import { Form, NavLink, useFetcher } from "@remix-run/react";
import { Link } from "react-router-dom";
//Re-usable elements for across the site
const storageCardStyle = "shadow-lg rounded-lg border-2 h-fit";
const headerStyle =
  "block text-black bg-white text-left rounded-lg pb-2 border-b-2 border-white p-5";
const ulStyle = "text-sm list-disc pl-10 my-5 mx-5 text-left";
const buttonStyle2 = "button mx-5";
const linkStyle = "text-indigo-400";
const menuStyle = "flex p-5 w-full";

interface UserMenuProps {
  apiKey: string | null;
  provider: string;
  isImage: string;
  isMetadata: string;
  baseURI: string;
}
//https://docs.walletconnect.com/2.0/web/web3modal/react/wagmi/theming

export function UserMenu({
  apiKey,
  provider,
  isImage,
  isMetadata,
  baseURI,
}: UserMenuProps) {
  return (
    <div className={menuStyle}>
      <Link to="/history" className={buttonStyle2 + "p-5"}>
        History
      </Link>
      <p className="p-5">Provider: {provider}</p>
      <p className="p-5">API Key: {apiKey}</p>
      <p className="p-5">Images: {isImage}</p>
      <p className="p-5"> Metadata: {isMetadata}</p>
      <p className="p-5"> baseURI: {baseURI}</p>
    </div>
  );
}

export function StorageCard0Step() {
  return (
    <div
      className={`flex h-full flex-grow flex-col rounded-lg border py-4 text-left shadow-lg`}
    >
      <div className="flex-grow">
        <h2 className="px-4 text-[--clr-primary]">
          STEP 01 → GENERATE AN API KEY
        </h2>
        <p className="px-4 py-3">
          Create an NFT.STORAGE account and/or log in and proceed to{" "}
          <a href="https://nft.storage/new-key" className={linkStyle}>
            https://nft.storage/manage/
          </a>
        </p>
        <p className="px-4">
          Press the '+NEW KEY' button to generate a new API key.
        </p>
      </div>
      <div className="flex justify-end border-t px-4 pt-4">
        <div className="w-fit rounded-md bg-[#d0abff] px-4 py-2 text-black drop-shadow-md">
          Create NFT.STORAGE API key
        </div>
      </div>
    </div>
  );
}

export function StorageCard1() {
  return (
    <div className={`${storageCardStyle}`}>
      <label className={headerStyle}>Instareveal - Setup</label>
      <h1 className="text-md">SETUP:</h1>
      <div className="text-sm">
        <ul className={ulStyle}>
          <li>
            To use Instareveal please create the collection on{" "}
            <a
              className="text-indigo-500"
              href="https://www.scatter.art/create?contract=ERC721"
            >
              Scatter
            </a>{" "}
            first.
          </li>
        </ul>
      </div>
      <h1 className="text-md">FEATURES:</h1>
      <ul className={ulStyle}>
        <li>Premium Delivery.</li>
        <li>Instantly reveal NFT artwork.</li>
        <li>Uses IPFS</li>
        <li>Prevents your art from being stolen.</li>
        <li>Only works on Mainnet Ethereum currently.</li>
      </ul>
    </div>
  );
}

export function StorageCard1Step() {
  return (
    <div className={storageCardStyle}>
      <label className={headerStyle}>STEP 01 → REQUEST ACCESS:</label>
      <p className="p-10 text-left text-base">
        Instareveal is a service that Scatter provides to enable token reveals
        at time of minting. Currently this service is available exclusively for
        collections which launch with Scatter. Access to this service is by
        request only - please contact us in our{" "}
        <a className="text-indigo-500" href="https://discord.gg/6pz7qNRmPM">
          Discord
        </a>{" "}
        by opening a support ticket.
      </p>
    </div>
  );
}
export function StorageCard1Step2() {
  return (
    <div className={`${storageCardStyle} text-left`}>
      <label className={headerStyle}>STEP 02 → PROVIDE API KEY</label>
      <ul className={ulStyle}>
        <li>
          Please paste in the API key we provided you in the support ticket,
        </li>
        <li>
          Enter your collection name as all-one-word, No spaces, or special
          characters,
        </li>
        <li>
          Then paste in the contract address found at the top of your
          collection's page on Scatter.
        </li>
      </ul>
    </div>
  );
}

export function StorageCard2() {
  return (
    <div className={storageCardStyle}>
      <label className={headerStyle}>ARWeave</label>
      <p className="p-10 text-left text-base">
        Arweave is an advanced solution for creators, to use it, you must have
        an API key from BLANK
      </p>
      <ul className={ulStyle}>
        <li>Permanent storage.</li>
        <li>Requires payment in crypto.</li>
        <li>Uses ARweave</li>
      </ul>
    </div>
  );
}

export function StorageCard2Step() {
  return (
    <div className={storageCardStyle}>
      <label className={headerStyle}>STEP 01 → GET AN API KEY:</label>
      <p className="p-10 text-left text-base">
        Go to{" "}
        <a href="https://nft.storage" className={linkStyle}>
          NFT.Storage
        </a>{" "}
        and login or make an account then{" "}
        <a href="https://nft.storage/new-key" className={linkStyle}>
          create an API key
        </a>
        .
      </p>
    </div>
  );
}

export const buttonStyle =
  "bottom-0 rounded px-4 py-2 text-black hover:bg-blue-600 w-full border-2";

export function StorageSelect({
  formSubmitted,
  title,
  buttonValue,
  description,
  infoPoints,
  highlighted,
  comingSoon,
}: {
  formSubmitted: boolean;
  title: string;
  buttonValue: string;
  description: string;
  infoPoints: string[];
  highlighted?: boolean;
  comingSoon?: boolean;
}) {
  return (
    <div className="min-h-96 relative flex w-1/3 flex-grow flex-col justify-between rounded-lg border shadow-lg">
      {comingSoon && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10 text-xl text-white">
          <span className="text-center text-xl text-white">COMING SOON...</span>
        </div>
      )}
      <div className={`flex flex-col ${comingSoon ? "blur-sm" : ""}`}>
        <label
          className={`block rounded-t-lg border-b border-[--clr-primary-light-x] p-3 pl-6 text-left ${
            highlighted
              ? "bg-[--clr-primary] text-black"
              : "bg-[#5e5a63] text-white"
          }`}
        >
          {title}
        </label>
        <div className="flex-grow p-6">{description}</div>
        <ul className="list-disc border-y border-[--clr-primary-light-x] p-4 pl-8 text-sm">
          {infoPoints.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      </div>
      <div className={`p-3 ${comingSoon ? "blur-sm" : ""}`}>
        <button
          type="submit"
          disabled={formSubmitted || comingSoon}
          className={`w-full rounded-md border border-[--clr-primary] p-3 text-[--clr-primary] ${
            !comingSoon
              ? "transition-colors hover:bg-[--clr-primary] hover:text-black"
              : ""
          }`}
          name="_action"
          value={buttonValue}
        >
          SELECT
        </button>
      </div>
    </div>
  );
}

type AMenuProps = {
  formSubmitted: boolean;
  inputted: boolean;
};

export function AMenu({ formSubmitted, inputted }: AMenuProps) {
  const { submit } = useFetcher();

  // Clear Uploads
  async function clearFiles() {
    console.log("clearing uploads from upload.tsx");
    // setFiles([]);

    try {
      submit(null, {
        preventScrollReset: true,
        method: "post",
        action: "/clearUploads",
      });
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="relative flex h-fit w-full justify-end border-t px-2 py-4">
      <div onClick={() => clearFiles()} className="button">
        CLEAR UPLOADS
      </div>
      <button
        type="submit"
        className="button ml-5 mr-2"
        disabled={formSubmitted}
      >
        CONTINUE →
      </button>
    </div>
  );
}

type CMenuProps = {
  formSubmitted: boolean;
};

export function CMenu({ formSubmitted }: CMenuProps) {
  return (
    <div className="flex h-fit w-full items-center justify-between border-t px-2 py-4">
      <NavLink
        to="/storage"
        className={({ isActive, isPending }) =>
          isPending ? "" : isActive ? "" : ""
        }
      >
        <div className="ml-2 rounded-lg border border-[--clr-primary] p-2 px-6 text-[--clr-primary]">
          ← BACK
        </div>
      </NavLink>
      <button disabled={formSubmitted} type="submit" className="button mr-2">
        CONTINUE →
      </button>
    </div>
  );
}

export function DLoading() {
  const containerStyle = "flex flex-col justify-center items-stretch h-full";
  const topRowStyle = "flex justify-between";
  const divStyle =
    "shadow-lg rounded-lg border-2 p-4 w-1/3 mx-5 my-5 break-all text-center justify-center text-xs";
  const bottomRowStyle =
    "flex justify-between justify-center border-2 border-white rounded my-10 mx-10";
  const bottomRow1Style =
    "flex justify-between justify-center border-2 border-white rounded mb-10 mt-1 mx-10 text-center";
  const headerStyle = "border-b-2 border-white w-full justify-center";
  const footerStyle = "border-t-2 border-white justify-center";
  const spinnerStyle =
    "animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-500 mx-auto"; // Updated spinnerStyle

  return (
    <div className="text-1xl h-full w-full rounded-2xl text-center tracking-tight">
      <Form className="h-full">
        <div className={containerStyle}>
          <div className={topRowStyle}>
            <div className={divStyle}>
              <p className={headerStyle}>01 Deploy Images</p>
              <div className="my-10">
                <div className={spinnerStyle}></div>
              </div>
              <p className={footerStyle}>Deploying...</p>
            </div>
            <div className="mx-5 my-5 w-1/3 break-all rounded-lg border-2 p-4 text-center text-xs shadow-lg">
              <p className={headerStyle}>02 Apply Images to Metadata</p>
              <p className="my-10">
                <div className={spinnerStyle}></div>
              </p>
              <p className={footerStyle}>Deploying...</p>
            </div>
            <div className={divStyle}>
              <p className={headerStyle}>03 Deploy Metadata</p>
              <div className="my-10">
                <div className={spinnerStyle}></div>
              </div>
              <p className={footerStyle}>Deploying...</p>
            </div>
          </div>
          <div className={`${bottomRowStyle}`}>
            <div className="border-r-2 p-10">Base URI:</div>
            <div className="p-10">
              <div className={spinnerStyle}></div>
            </div>
            <div className="border-l-2 p-10">
              <button type="button" className="ml-2 hover:text-blue-500">
                📋
              </button>
            </div>
            <div className={`${bottomRow1Style}`}>
              <div className="w-1/3 border-r-2 p-10">Gateway:</div>
              <div className={spinnerStyle}></div>
              <div className="border-l-2 p-10">
                <button type="button" className="ml-2 hover:text-blue-500">
                  📋
                </button>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}

export function DMenu() {
  return (
    <div className=" h-fit w-full border-2 border-white">
      <div className=" left-0 mx-2.5 my-2.5 w-full">
        <p className="text-left">Deployment complete, baseURI ready.</p>
      </div>
    </div>
  );
}
