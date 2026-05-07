import { cssBundleHref } from "@remix-run/css-bundle";
import {
  ActionFunctionArgs,
  json,
  type LinksFunction,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import {
  isRouteErrorResponse,
  Links,
  LiveReload,
  Meta,
  MetaFunction,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import { mainnet } from "viem/chains";
import StepIndicator from "~/components/step-indicator";
import rootCss from "~/style/root.css";
import styleDictionary from "~/style/style-dictionary/_STYLE_TOKENS_.css";
import stylesheet from "~/tailwind.css";
import faviconSvg from "~/assets/favicon.svg";
import { API_Upload } from "./api/upload";
import {
  getApiKey,
  getLatestUploadBaseURI,
  getSelectedProvider,
  getUserDetails,
} from "./models/note.server";
import { authenticate, sessionStorage } from "./session.server";

const chains = [mainnet];
const PROJECT_ID = "0ed19f2e5585e61513243f991dce0c76";

const metadata = {
  name: "Scatter Uploader",
  description: "Web app for permanently storing collection art and metadata",
  url: "https://uploader.scatter.art",
  icons: ["https://www.scatter.art/favicon/catbox_accent_48.png"],
};

const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId: PROJECT_ID,
  metadata,
});

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "stylesheet", href: styleDictionary },
  { rel: "stylesheet", href: rootCss },
  { rel: "icon", href: faviconSvg, type: "image/svg+xml" },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export function ErrorBoundary() {
  const error = useRouteError();
  let isUpload = false;
  let isValidated = false;
  let isStorage = false;
  let errorblock;
  // when true, this is what used to go to `CatchBoundary`
  if (isRouteErrorResponse(error)) {
    errorblock = (
      <>
        <div className="text-center text-lg">
          <p>Oops</p>
          <p>Status: {error.status}</p>
        </div>
        <div className="mt-8 text-center text-2xl">
          <p>{error.data.message}</p>
        </div>
      </>
    );
  }

  // Don't forget to typecheck with your own logic.
  // Any value can be thrown, not just errors!
  if (!isRouteErrorResponse(error)) {
    const errorMessage = (error as Error).message;
    errorblock = (
      <>
        <div className="text-center text-lg">
          <p>Uh oh...Something went wrong.</p>
        </div>
        <div className="mt-8 text-center text-2xl">
          <p>{errorMessage}</p>
        </div>
      </>
    );
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script
          type="module"
          src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.1.1/model-viewer.min.js"
        ></script>
      </head>
      <body>
        <div className="flex h-full w-full flex-col rounded-lg">
          <StepIndicator
            isUpload={isUpload}
            isValidated={isValidated}
            isStorage={isStorage}
          />
          <div className="my-16">{errorblock}</div>
          <Outlet />
          <FooterLinks />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const userData = await authenticate(request);
    if (!userData.id) {
      console.error("Unable to get user id. Record might have been deleted?");
      return json({
        hasError: true,
        previousBaseURI: "",
        apiKey: "",
        provider: "",
        isUpload: "",
        userId: "",
        directory: "",
        isStorage: "",
        isValidated: "",
      });
    }
    const userDetails = await getUserDetails(userData.id);
    if (userDetails != null) {
      console.log(userDetails);
    }
    const { id: userId, directory, session } = userData;
    const provider = await getSelectedProvider(userId);
    const apiKey = await getApiKey(userId, provider);
    const isStorage = userDetails?.isStorage?.isTrue || false;
    //const isImage = userDetails?.isImage?.isTrue;
    //const isMetadata = userDetails?.isMetadata?.isTrue;
    const previousBaseURI = await getLatestUploadBaseURI(userId);
    const isUpload = userDetails?.isUpload?.isTrue || false;
    const isValidated = userDetails?.isValidate?.isTrue || false;

    return json(
      {
        hasError: false,
        userId,
        directory,
        apiKey,
        provider,
        isUpload,
        isValidated,
        previousBaseURI,
        isStorage,
      },
      {
        headers: {
          "Set-Cookie": await sessionStorage.commitSession(session, {
            maxAge: 60 * 60 * 24 * 7, // 7 days
          }),
        },
      }
    );
  } catch (error) {
    console.log("Failure on the root loader: " + error);
    return json({
      hasError: true,
      previousBaseURI: "",
      apiKey: "",
      provider: "",
      isUpload: "",
      userId: "",
      directory: "",
      isStorage: "",
      isValidated: "",
    });
  }
}

export const meta: MetaFunction = () => {
  return [
    {
      title: "Scatter NFT Uploader - Beta Testing",
    },
    {
      name: "description",
      content:
        "Upload your NFTs with ease using the Scatter NFT Uploader. Developed by Scatter, this powerful tool is designed for seamless NFT uploading. Join the Beta testing phase now.",
    },
    {
      property: "og:title",
      content: "Scatter NFT Uploader - Beta Testing",
    },
    {
      property: "og:description",
      content:
        "Upload your NFTs with ease using the Scatter NFT Uploader. Developed by Scatter, this powerful tool is designed for seamless NFT uploading. Join the Beta testing phase now.",
    },
    {
      property: "og:image",
      content: "https://uploader.scatter.art/nft-uploader-preview.jpg",
    },
    {
      name: "twitter:title",
      content: "Scatter NFT Uploader - Beta Testing",
    },
    {
      name: "twitter:description",
      content:
        "Upload your NFTs with ease using the Scatter NFT Uploader. Developed by Scatter, this powerful tool is designed for seamless NFT uploading. Join the Beta testing phase now.",
    },
    {
      name: "twitter:image",
      content: "https://uploader.scatter.art/nft-uploader-preview.jpg",
    },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  try {
    await API_Upload(request);
    return new Response("OK", { status: 200 });
  } catch (e: any) {
    console.error(e);
    throw new Error(e.toString());
  }
}

export default function App() {
  const loadData = useLoaderData<typeof loader>();

  const {
    //previousBaseURI,
    //apiKey,
    //provider,
    //hasError,
    //userId,
    //directory,
    isUpload,
    isStorage,
    isValidated,
  } = loadData;

  const stringToBoolean = (value: string | boolean): boolean => {
    if (typeof value === "boolean") {
      return value;
    }
    return value.toLowerCase() === "true";
  };

  const isUploadBool = stringToBoolean(isUpload);
  const isValidatedBool = stringToBoolean(isValidated);
  const isStorageBool = stringToBoolean(isStorage);

  createWeb3Modal({
    wagmiConfig,
    projectId: PROJECT_ID,
    chains,
    themeMode: "dark",
    themeVariables: {
      "--w3m-font-family": "Roboto, sans-serif",
      "--w3m-accent": "rgb(31 41 55)",
    },
  });

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script
          type="module"
          src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.1.1/model-viewer.min.js"
        ></script>
      </head>
      <body>
        <div className="flex h-full w-full flex-col rounded-lg">
          <StepIndicator
            isUpload={isUploadBool}
            isValidated={isValidatedBool}
            isStorage={isStorageBool}
          />
          <Outlet />
          <FooterLinks />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

const FooterLinks = () => {
  return (
    <div className="flex space-x-4 p-4">
      <NavLink to="/history">Upload History</NavLink>
      <span className="text-white">[v2]</span>

      <a href="https://discord.gg/6pz7qNRmPM">
        <img className="h-5 w-5" src="/discord-mark-white.svg" alt="Discord" />
      </a>
      <a href="https://twitter.com/scatter_art">
        <img className="h-5 w-5" src="/twitter-x-mark-white.svg" alt="X" />
      </a>
      <a href="https://scatter.art/">
        <img className="h-5 w-5" src="/scatter-logo.png" alt="Scatter" />
      </a>
    </div>
  );
};
