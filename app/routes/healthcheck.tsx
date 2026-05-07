// learn more: https://fly.io/docs/reference/configuration/#services-http_checks
import type { LoaderFunctionArgs } from "@remix-run/node";

import { prisma } from "~/db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  //const host =
  //  request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");

  try {
    //const url = new URL("/", `http://${host}`);
    // if we can connect to the database and make a simple query then we're good.
    await Promise.all([prisma.user.count()]);
    return new Response("OK");
  } catch (error: unknown) {
    console.log("healthcheck ❌", { error });
    return new Response("ERROR", { status: 500 });
  }
};
