import { json, redirect, type ActionFunctionArgs } from "@remix-run/node";
import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { prisma } from "~/db.server";
import { ErrorHandler } from "~/components/error-block";
import { getDirectory } from "~/models/note.server";

export function ErrorBoundary() {
  const error = useRouteError();
  // console.error({ error });

  return <ErrorHandler error={error} type={isRouteErrorResponse(error)} />;
}

export const loader = async () => {
  throw redirect("/", 301);
};

export async function action({ request }: ActionFunctionArgs) {
  try {
    console.log("updating user");
    const body = await request.formData();

    const userId = body.get("userId") as string;
    let address = body.get("address") as string;

    let directory = "";
    const currentDirectory = await getDirectory(userId);

    if (currentDirectory === address) {
      return json({
        ok: true,
        message: `Directory ${currentDirectory} already assigned to user`,
      });
    } else {
      directory = address;
    }

    const res = await prisma.user.update({
      where: { id: userId },
      data: { directory },
    });

    if (!res) {
      throw new Error("Unable to assign directory to user");
    }

    // return new Response(`User directory reassigned to ${directory}`);
    return redirect("/");
  } catch (error) {
    console.error(error);
    return new Response("Error updating user");
  }
}
