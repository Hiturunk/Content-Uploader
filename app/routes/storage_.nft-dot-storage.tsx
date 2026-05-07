import {
  Form,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import DocsLink from "~/components/docs-link";
import { CMenu, DLoading, StorageCard0Step } from "~/components/elements";
import { ErrorHandler } from "~/components/error-block";
import { getApiKey, getSelectedProvider } from "~/models/note.server";
import { getSession } from "~/session.server";

export function ErrorBoundary() {
  const error = useRouteError();
  return <ErrorHandler error={error} type={isRouteErrorResponse(error)} />;
}

export async function loader({ request }: { request: Request }) {
  try {
    const session = await getSession(request);
    let userId = await session.get("userId");
    let provider = await getSelectedProvider(userId);
    let apiKey = await getApiKey(userId, provider);
    return {
      userId,
      apiKey,
    };
  } catch (error) {
    throw new Error(
      "Error on loader of storage page for NFT.Dot Storage " + error
    );
  }
}

export default function Index() {
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State to manage loading animation
  const [formSubmitted, setFormSubmitted] = useState(false);

  const loadData = useLoaderData() as {
    apiKey: string;
  };
  const apiKey = loadData.apiKey;

  // Handle API key input change
  function handleApiKeyInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setApiKeyInput(event.target.value);
  }
  function onSubmit() {
    setFormSubmitted(true); // Set form as submitted
    setIsLoading(true);
  }

  useEffect(() => {
    setApiKeyInput(apiKey);
  }, [apiKey]);

  return (
    <div className="h-full rounded-b-2xl border-x border-b">
      {isLoading ? (
        <DLoading />
      ) : (
        <div className="flex h-full w-full flex-col">
          <Form
            action="/deploy/"
            method="POST"
            onSubmit={onSubmit}
            className="flex h-full flex-col"
          >
            <div className="flex h-full w-full">
              <div className="flex w-1/3 flex-col justify-between border-r pt-6">
                <div className="px-6">
                  <h1 className="text-sm text-[--clr-primary-light-x]">
                    NFT.STORAGE SETUP
                  </h1>
                  <div className="mt-3 flex flex-col gap-6">
                    <p className="text-[--clr-primary]">
                      You're almost there, now it's time to make things
                      permanent by choosing an IPFS storage option.
                    </p>
                    <p>
                      NFT.STORAGE is our recommended IPFS storage solution,
                      simply generate and provide your API key to begin.
                    </p>
                    <p>
                      Scatter.art also provides a unique instareveal service.
                      This is currently invite only.
                    </p>
                  </div>
                </div>
                <div>
                  <DocsLink
                    title="What is IPFS?"
                    href="https://docs.scatter.art/docs/creators/upload-to-ipfs"
                  />
                  <DocsLink
                    title="Getting an API token"
                    href="https://nft.storage/docs/#get-an-api-token"
                    docsTitle="NFT.STORAGE DOCS"
                  />
                </div>
              </div>
              <div className="flex w-2/3 flex-col gap-6 p-6">
                <StorageCard0Step />
                <div className="flex h-full w-full flex-col justify-between rounded-lg border">
                  <div>
                    <div className="mb-2 text-left">
                      <p className="px-4 pt-4 text-[--clr-primary]">
                        STEP 02 → PROVIDE API KEY
                      </p>
                      <p className="px-4 py-3">
                        Copy and paste your NFT.STORAGE API key below ↘
                      </p>
                    </div>
                  </div>
                  <div className="flex border-t">
                    <p className="rounded-l-md p-6 text-lg leading-6 text-[--clr-primary]">
                      API KEY:
                    </p>
                    <input
                      id="apiKey"
                      name="apiKey"
                      type="text"
                      value={apiKeyInput}
                      onChange={handleApiKeyInputChange}
                      className="flex-1 rounded-r-md border-l border-[--clr-primary-light-x] bg-[--clr-bg] px-3 py-2 text-lg leading-6 text-[--clr-primary]"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-auto w-full">
              <CMenu formSubmitted={formSubmitted} />
            </div>
          </Form>
        </div>
      )}
    </div>
  );
}
