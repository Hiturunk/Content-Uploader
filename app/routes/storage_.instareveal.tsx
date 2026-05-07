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
  StorageCard1,
  StorageCard1Step,
  StorageCard1Step2,
} from "~/components/elements";
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
    throw new Error("Error on loader of storage page for Instareveal " + error);
  }
}

export default function Index() {
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [collectionInput, setCollectionInput] = useState("");
  const [contractInput, setContractInput] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [isLoading, setIsLoading] = useState(false); // State to manage loading animation
  const loadData = useLoaderData() as {
    apiKey: string;
  };
  const apiKey = loadData.apiKey;

  // Handle API key input change
  function handleApiKeyInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const alphanumericRegex = /^[a-zA-Z0-9]*$/;
    if (!alphanumericRegex.test(event.target.value)) {
      console.log(`Please enter only alphanumeric characters for API Key.`);
      return;
    }
    setApiKeyInput(event.target.value);
  }
  function handleCollectionInputChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const alphanumericRegex = /^[a-zA-Z0-9]*$/;
    if (!alphanumericRegex.test(event.target.value)) {
      console.log(
        "Please enter only alphanumeric characters for Collection Name."
      );
    } else {
      setCollectionInput(event.target.value);
    }
  }
  function handleContractInputChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    const inputValue = event.target.value;

    // Handle the case when the user wants to delete the entire string
    if (inputValue === "") {
      setContractInput("");
      return;
    }

    if (!ethereumAddressRegex.test(inputValue)) {
      alert(`Please enter a valid Ethereum contract address.`);
      return;
    }

    setContractInput(inputValue);
  }

  function onSubmit() {
    setFormSubmitted(true); // Set form as submitted
    setIsLoading(true);
  }
  useEffect(() => {
    setApiKeyInput(apiKey);
  }, [apiKey]);

  return (
    <div className="rounded-b border-x border-b">
      {isLoading ? (
        <DLoading />
      ) : (
        <Form action="/deploy_instareveal/" method="POST" onSubmit={onSubmit}>
          <div className="h-full w-full text-center text-4xl font-extrabold tracking-tight sm:rounded-2xl sm:text-2xl lg:text-3xl">
            <div className="flex h-full justify-between">
              <div className="mx-5 my-5 h-full w-1/3">
                <StorageCard1 />
              </div>
              <div className="mx-5 my-5 flex-1">
                <StorageCard1Step />
                <div className="2x1 my-5 h-fit w-full border-2 sm:rounded">
                  <StorageCard1Step2 />
                  <div className="flex border-2">
                    <p className="w-36 rounded-l-md border-r-2 px-3 py-2 text-lg leading-6">
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
                  <div className="flex border-2">
                    <p className="w-36 rounded-l-md border-l-2 border-r-2 px-4 py-2 text-lg leading-6">
                      COLLECTION NAME:
                    </p>
                    <input
                      id="collection"
                      name="collection"
                      type="text"
                      value={collectionInput}
                      onChange={handleCollectionInputChange}
                      className="flex-1 rounded-r-md border-white px-3 py-2 text-lg leading-6 text-black"
                    />
                  </div>
                  <div className="flex border-2">
                    <p className="w-36 rounded-l-md border-l-2 border-r-2 px-4 py-2 text-lg leading-6">
                      Contract Address:
                    </p>
                    <input
                      id="contract"
                      name="contract"
                      type="text"
                      value={contractInput}
                      onChange={handleContractInputChange}
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
