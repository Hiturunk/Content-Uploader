import type { Blob, File } from "nft.storage";
import { NFTStorage } from "nft.storage";

export function NftDotStoragePrompt() {
  return (
    <div className="flex flex-col items-center border-2 border-solid border-indigo-600 sm:rounded-2xl">
      <p className="bold">
        To use our services to store your images on NFT.storage you will need to
        provide us with an API Key.
      </p>
      <p>
        Please go to{" "}
        <a href="https://nft.storage/new-key/">https://nft.storage/new-key/</a>{" "}
        to get an API key.
      </p>
      <p>Then paste the API key in to the field below.</p>
      <p>
        Once you have done that, upload a zip file with your images and proceed
        to the next step.
      </p>
    </div>
  );
}
export function NftDotStoragePromptC() {
  return (
    <div className="flex flex-col items-center border-2 border-solid border-indigo-600 bg-white sm:rounded-2xl">
      <p className="bold">
        Generating your metadata with us is totally optional.
      </p>
      <p>
        If you generate your metadata with us we will generate a collection with
        no traits corresponding to the amount of images you uploaded.
      </p>
      <p>Feel free to skip this step by clicking next if you prefer.</p>
    </div>
  );
}

export async function storeNFT(data: File[], apiKey: string) {
  // create a new NFTStorage client using our API key
  const nftstorage = new NFTStorage({ token: apiKey });
  console.log(data);
  return await nftstorage.storeDirectory(data);
}
// short random string for ids - not guaranteed to be unique

export async function storeNFTSingle(data: Blob, apiKey: any) {
  // create a new NFTStorage client using our API key
  const nftstorage = new NFTStorage({ token: apiKey });
  console.log(data);
  return await nftstorage.storeBlob(data);
}

export const randomId = function (length: number) {
  return Math.random()
    .toString(36)
    .substring(2, length + 2);
};
