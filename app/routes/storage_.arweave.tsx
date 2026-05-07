import {
  Form,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import {
  CMenu,
  DLoading,
  StorageCard2,
  StorageCard2Step,
} from "~/components/elements";
import { ErrorHandler } from "~/components/error-block";
import { getApiKey, getSelectedProvider } from "~/models/note.server";
import { getSession } from "~/session.server";

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
    throw new Error("Error on loader of storage page for arweave " + error);
  }
}

export function ErrorBoundary() {
  const error = useRouteError();
  return <ErrorHandler error={error} type={isRouteErrorResponse(error)} />;
}

export default function Index() {
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State to manage loading animation
  const [formSubmitted, setFormSubmitted] = useState(false);

  const loadData = useLoaderData() as {
    apiKey: string;
  };
  const apiKey = loadData.apiKey;

  function onSubmit() {
    setFormSubmitted(true); // Set form as submitted
    setIsLoading(true);
  }
  // Handle API key input change
  function handleApiKeyInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setApiKeyInput(event.target.value);
  }
  useEffect(() => {
    setApiKeyInput(apiKey);
  }, [apiKey]);

  return (
    <div>
      {isLoading ? (
        <DLoading />
      ) : (
        <Form action="/deploy/" method="POST" onSubmit={onSubmit}>
          <div className="h-full w-full text-center text-4xl font-extrabold tracking-tight sm:rounded-2xl sm:text-2xl lg:text-3xl">
            <div className="flex justify-between">
              <div className="mx-5 my-5 w-1/3">
                <StorageCard2 />
              </div>
              <div className="mx-5 my-5 flex-1">
                <StorageCard2Step />
                <div className="2x1 my-5 h-fit w-full border-2 sm:rounded">
                  <div className="mb-2 text-left">
                    <p className="mx-5 my-5">Step 2 → Provide an API key.</p>
                  </div>
                  <div className="flex border-2">
                    <p className="rounded-l-md border-r-2 px-3 py-2 text-lg leading-6">
                      API KEY:
                    </p>
                    <input
                      id="apiKey"
                      name="apiKey"
                      type="text"
                      value={apiKeyInput}
                      onChange={handleApiKeyInputChange}
                      className="flex-1 rounded-r-md border-white px-3 py-2 text-lg leading-6 text-black"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <CMenu formSubmitted={formSubmitted} />
        </Form>
      )}
    </div>
  );
}
