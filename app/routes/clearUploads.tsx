import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { ErrorHandler } from "~/components/error-block";
import { clearDirectory } from "~/lib/fileOperations";
import {
  setIsImage,
  setIsMetadata,
  setIsStorage,
  setIsUpload,
  setIsValidated,
} from "~/models/note.server";
import { authenticate } from "~/session.server";
import { getUploadsDirectory } from "~/utils";

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
    console.log("action: clearing uploads directory");

    const userData = await authenticate(request);

    if (!userData.id || !userData.directory) {
      throw new Error("Invalid session");
    }

    const { directory: directoryName, id: userId } = userData;

    console.log({ directoryName, userId });

    if (!directoryName) {
      throw new Error("No directoryName provided!");
    }

    const uploadsDirectory = getUploadsDirectory(
      directoryName,
      process.env.NODE_ENV
    );

    console.log("clearing directory:", uploadsDirectory);

    await clearDirectory(uploadsDirectory);
    await setIsImage(userId, false);
    await setIsUpload(userId, false);
    await setIsMetadata(userId, false);
    await setIsValidated(userId, false);
    await setIsStorage(userId, false);
    return new Response("Directory cleared");
  } catch (error) {
    console.error(error);
    return new Response("Error clearing directory");
  }
}
