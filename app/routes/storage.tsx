import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, isRouteErrorResponse, useRouteError } from "@remix-run/react";
import * as fs from "fs/promises";
import path from "path";
import { useState } from "react";
import DocsLink from "~/components/docs-link";
import { StorageSelect } from "~/components/elements";
import { ErrorHandler } from "~/components/error-block";
import {
  getApiKey,
  getDirectory,
  getSelectedProvider,
  setSelectedProvider,
} from "~/models/note.server";
import { getSession } from "~/session.server";
import { getUploadsDirectory } from "~/utils";

export async function action({ request }: ActionFunctionArgs) {
  try {
    const formdata = await request.formData();
    let action = formdata.get("_action");
    const session = await getSession(request);
    let userId = await session.get("userId");
    if (action === "nft-dot-storage") {
      await setSelectedProvider(userId, "nft-dot-storage");
      return redirect(`./nft-dot-storage`);
    }
    if (action === "instareveal") {
      await setSelectedProvider(userId, "instareveal");
      return redirect(`./instareveal`);
    }
    if (action === "arweave") {
      await setSelectedProvider(userId, "arweave");
      return redirect(`./arweave`);
    }
  } catch (error) {
    throw new Error("Error on action of storage selection page " + error);
  }
}

export function ErrorBoundary() {
  const error = useRouteError();
  return <ErrorHandler error={error} type={isRouteErrorResponse(error)} />;
}

export async function loader({ request }: { request: Request }) {
  try {
    const session = await getSession(request);
    let userId = await session.get("userId");
    let provider = await getSelectedProvider(userId);
    const apiKey = getApiKey(userId, provider);
    let directory = await getDirectory(userId);
    const NODE_ENV = process.env.NODE_ENV || "production";
    const uploadsDirectory = getUploadsDirectory(directory, NODE_ENV);

    let numImages = 0;
    let numMetadata = 0;
    let imagefiles;
    try {
      imagefiles = await fs.readdir(path.join(uploadsDirectory, "images"));
      numImages = imagefiles.length;
    } catch (err) {
      console.error(`Error reading directory: ${err}`);
    }
    let metadatafiles;
    try {
      metadatafiles = await fs.readdir(path.join(uploadsDirectory, "json"));
      numMetadata = metadatafiles.length;
    } catch (err) {
      console.error(`Error reading directory: ${err}`);
    }

    let summary =
      "You have prepared " +
      numImages +
      " image file(s) and " +
      numMetadata +
      " metadata file(s) for upload.";

    // Return the URL data as loaderData to be passed to the component
    return {
      userId,
      apiKey,
      summary,
    };
  } catch (error) {
    throw new Error("Error on loader of storage page" + error);
  }
}

export default function Page() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  function handleSubmit() {
    setFormSubmitted(true); // Set form as submitted
  }

  return (
    <div className="flex h-full w-full flex-col rounded-b-2xl border-x border-b">
      <div className="flex h-full w-full">
        <div className="flex w-1/3 flex-col border-r pt-6">
          <div className="flex-grow px-6">
            <h1 className="text-sm text-[--clr-primary-light-x]">
              CHOOSING A STORAGE PROVIDER
            </h1>
            <div className="mt-3 flex flex-col gap-6">
              <p className="text-[--clr-primary]">
                You're almost there, now it's time to make things permanent by
                choosing an IPFS storage option.
              </p>
              <p>
                NFT.STORAGE is our recommended IPFS storage solution, simply
                generate and provide your API key to begin.
              </p>
              <p>
                Scatter.art also provides a unique instareveal service. This is
                currently invite only.
              </p>
            </div>
          </div>

          <div>
            <DocsLink
              title="What is IPFS?"
              href="https://docs.scatter.art/docs/creators/upload-to-ipfs"
            />
            <DocsLink
              title="Instareveal"
              href="https://docs.scatter.art/docs/creators/instareveal"
            />
          </div>
        </div>
        <div className="flex w-2/3">
          <Form onSubmit={handleSubmit} method="POST">
            <div className="flex h-full w-full items-center gap-6 p-6">
              <StorageSelect
                formSubmitted={formSubmitted}
                title="NFT.STORAGE"
                buttonValue="nft-dot-storage"
                description="Nft.storage is our recommended solution for new users."
                infoPoints={[
                  "Free",
                  "Easy to use",
                  "Uses IPFS",
                  "All artwork is publicly revealed before mint",
                ]}
              />
              <StorageSelect
                highlighted
                formSubmitted={formSubmitted}
                title="Instareveal"
                buttonValue="instareveal"
                description="Instareveal is our premium solution for creators."
                infoPoints={[
                  "Free",
                  "Premium delivery",
                  "Uses IPFS",
                  "Instantly reveal NFT artwork when users mint",
                ]}
              />
              <StorageSelect
                comingSoon
                formSubmitted={formSubmitted}
                title="Arweave"
                buttonValue="arweave"
                description="Arweave is an advanced solution for permanent storage."
                infoPoints={[
                  "Permanent storage",
                  "Requires payment in crypto",
                  "All artwork is publicly revealed before mint",
                ]}
              />
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
