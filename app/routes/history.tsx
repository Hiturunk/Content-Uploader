import { Form, useLoaderData } from "@remix-run/react";
import type {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactFragment,
  ReactPortal,
} from "react";
import { getSession } from "~/session.server";
import { getPreviousUploads } from "../models/note.server";

export async function loader({ request }: { request: Request }) {
  try {
    const session = await getSession(request);
    const userID = session.get("userId");
    let x = await getPreviousUploads(userID);
    return x;
  } catch (error) {
    throw new Error("Error on loader of generated metadata page" + error);
  }
}

function UserUploadsPage() {
  //const loaderData = useRouteLoaderData("root");
  const historyLoader = useLoaderData();
  const uploads = historyLoader as any;

  return (
    <Form>
      <div>
        <h1 className="text-center">User Uploads</h1>
        {uploads && uploads.length > 0 ? (
          uploads.map(
            (upload: {
              id: Key | null | undefined;
              name:
                | string
                | number
                | boolean
                | ReactElement<any, string | JSXElementConstructor<any>>
                | ReactFragment
                | ReactPortal
                | null
                | undefined;
              baseURI:
                | string
                | number
                | boolean
                | ReactElement<any, string | JSXElementConstructor<any>>
                | ReactFragment
                | ReactPortal
                | null
                | undefined;
              imageURI:
                | string
                | number
                | boolean
                | ReactElement<any, string | JSXElementConstructor<any>>
                | ReactFragment
                | ReactPortal
                | null
                | undefined;
              numFiles:
                | string
                | number
                | boolean
                | ReactElement<any, string | JSXElementConstructor<any>>
                | ReactFragment
                | ReactPortal
                | null
                | undefined;
              createdAt: string | number | Date;
              updatedAt: string | number | Date;
            }) => (
              <div className="border-2 p-2 text-center" key={upload.id}>
                <h2>Upload name: {upload.name}</h2>
                <p>Base URI: {upload.baseURI}</p>
                <p>Image URI: {upload.imageURI}</p>
                <p>Number of Files: {upload.numFiles}</p>
                <p>Created At: {new Date(upload.createdAt).toLocaleString()}</p>
                <p>Updated At: {new Date(upload.updatedAt).toLocaleString()}</p>
                {/* Render other properties as needed */}
              </div>
            )
          )
        ) : (
          <p>No uploads found</p>
        )}
      </div>
    </Form>
  );
}

export default UserUploadsPage;
