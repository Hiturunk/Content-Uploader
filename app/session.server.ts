import { createCookieSessionStorage, redirect } from "@remix-run/node";
import bcrypt from "bcryptjs";
import invariant from "tiny-invariant";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "~/db.server";
import type { User } from "~/models/user.server";
import { getUserById } from "~/models/user.server";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

const USER_SESSION_KEY = "userId";

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");

  return sessionStorage.getSession(cookie);
}

export async function getUserId(
  request: Request
): Promise<User["id"] | undefined> {
  const session = await getSession(request);
  const userId = session.get(USER_SESSION_KEY);
  return userId;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (userId === undefined) return null;

  const user = await getUserById(userId);
  if (user) return user;

  throw await logout(request);
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const userId = await getUserId(request);
  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function requireUser(request: Request) {
  const userId = await requireUserId(request);

  const user = await getUserById(userId);
  if (user) return user;

  throw await logout(request);
}

export async function createUserSession({
  request,
  userId,
  remember,
  redirectTo,
}: {
  request: Request;
  userId: string;
  remember: boolean;
  redirectTo: string;
}) {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined,
      }),
    },
  });
}

export async function authenticate(request: Request) {
  const session = await getSession(request);
  const sessionUserId = session.get(USER_SESSION_KEY);
  const user = sessionUserId
    ? await getUserById(sessionUserId)
    : await createUser();

  if (!user) {
    session.unset(USER_SESSION_KEY);
    console.error("User not found. Please login again.");
    return { id: null, session };
  }

  session.set(USER_SESSION_KEY, user.id);

  return { ...user, session };
}

export async function createUser() {
  const id = uuidv4();
  const hashedPassword = await bcrypt.hash(id, 10);

  return await prisma.user.create({
    data: {
      email: id,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
      directory: id,
    },
  });
}

export async function logout(request: Request) {
  console.log("we are logging out");
  const session = await getSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
