import { redirect } from "@remix-run/node";
import { Form, isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import type { SetStateAction } from "react";
import { useState } from "react";
import { ErrorHandler } from "~/components/error-block";
import { generateMetadata } from "~/lib/pythonHandler";
import { createNote } from "~/models/note.server";
import { authenticate, getSession } from "~/session.server";
import { getUploadsDirectory } from "~/utils";

const scriptPath = path.join(
  __dirname,
  "../public/scripts/json/generate_json_args_no_traits_piped.py"
);

export function ErrorBoundary() {
  const error = useRouteError();
  return <ErrorHandler error={error} type={isRouteErrorResponse(error)} />;
}

export async function loader({ request }: { request: Request }) {
  try {
    const session = await getSession(request);
    console.log("session:", session);
    let userId = await session.get("userId");

    // Return the URL data as loaderData to be passed to the component
    return {
      userId,
    };
  } catch (error) {
    console.log("Error on loader of generated metadata page" + error);
  }
}

export async function action({ request }: { request: Request }) {
  try {
    const userData = await authenticate(request);

    if (!userData.id || !userData.directory) {
      throw new Error("Invalid session");
    }

    const { directory, id: userId } = userData;

    const formdata = await request.formData();
    const name = (formdata.get("name") as string) || "";
    const description = formdata.get("description") || "";
    const images = formdata.get("supply") || "";
    const projectSite = formdata.get("projectSite") || "";
    const imageId = parseInt(images.toString() || "0", 10);
    const args = ["REPLACEME", name, description, imageId, projectSite];
    const jsonFile = await generateMetadata(scriptPath, args);

    // Parse the JSON file into an array of JSON objects
    const jsonArray = JSON.parse(jsonFile as string);
    const dirPath = path.join(
      getUploadsDirectory(directory, process.env.NODE_ENV),
      "json"
    );
    fs.rmdirSync(dirPath, { recursive: true });
    fs.mkdirSync(dirPath, { recursive: true });

    // Iterate over each JSON object in the array
    for (let i = 0; i < jsonArray.length; i++) {
      const jsonObject = jsonArray[i];

      // Convert the JSON object to a JSON string
      const jsonString = JSON.stringify(jsonObject);

      // Write the JSON string to a file
      fs.writeFileSync(path.join(dirPath, `${i + 1}`), jsonString);
    }
    await createNote({ title: "isMetadata", userId, body: "true" });
    // Create a zip file from the JSON files
    const zipFilePath = path.join(
      getUploadsDirectory("/generatedJsons", process.env.NODE_ENV),
      `${name}-metadata.zip`
    );
    if (fs.existsSync(zipFilePath)) {
      fs.unlinkSync(zipFilePath);
    }
    const zip = spawn("zip", ["-r", zipFilePath, "."], { cwd: dirPath });

    zip.stderr.on("data", (data) => {
      throw new Error(`zip stderr: ${data}`);
    });

    zip.stdout.on("data", (data) => {
      console.log(`zip stdout: ${data}`);
    });

    let zipExitCode;

    zip.on("close", (code) => {
      zipExitCode = code;
    });

    await new Promise((resolve) => zip.on("exit", resolve));

    if (zipExitCode !== 0) {
      console.log(`zip process exited with code ${zipExitCode}`);
    }

    console.log(`Zip file has been created at ${zipFilePath}`);

    //return redirect(clientZipFilePath);
    return redirect("/validate");
  } catch (error) {
    throw new Error("Error while user generated Metadata" + error);
  }
}

export default function Page() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [supply, setSupply] = useState("");
  const [projectSite, setProjectSite] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNameChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setDescription(e.target.value);
  };

  const handleSupplyChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setSupply(e.target.value);
  };

  const handleProjectSiteChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setProjectSite(e.target.value);
  };

  //function handleDownloadClick() {
  //  setFormSubmitted(false);
  //}

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setFormSubmitted(true); // Set form as submitted
    console.log("Form submitted");
    setTimeout(() => setLoading(false), 1000);
  }

  return (
    <Form
      onSubmit={handleSubmit}
      method="POST"
      className="mx-auto h-full w-full text-center"
    >
      {loading && (
        <div className="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-gray-400"></div>
        </div>
      )}
      <div className="mb-4">
        <label htmlFor="name" className="block font-medium text-white">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={name}
          onChange={handleNameChange}
          className="relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-white text-center text-black"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block font-medium text-white">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={handleDescriptionChange}
          className="relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-white text-center text-black"
        ></textarea>
        <label htmlFor="supply" className="block font-medium text-white">
          Supply
        </label>
        <textarea
          id="supply"
          name="supply"
          value={supply}
          onChange={handleSupplyChange}
          className="relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-white text-center text-black"
        ></textarea>
        <label htmlFor="projectSite" className="block font-medium text-white">
          Project Site
        </label>
        <textarea
          id="projectSite"
          name="projectSite"
          value={projectSite}
          onChange={handleProjectSiteChange}
          className="relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-white text-center text-black"
        ></textarea>
      </div>
      {!formSubmitted && (
        <div className="mt-6">
          <button
            type="submit"
            disabled={formSubmitted}
            className="w-full rounded border-2 px-4 py-2 text-black hover:bg-blue-600"
          >
            Generate JSON
          </button>
        </div>
      )}
      {/*{formSubmitted && (
        <div>
          <button>
            <a
              href={clientZipFilePath}
              download
              onClick={handleDownloadClick}
              className={`${
                clientZipFilePath
                  ? "cursor-pointer text-blue-500"
                  : "cursor-not-allowed text-gray-500"
              }`}
            >
              Download
            </a>
          </button>
          <button>
            <NavLink
              to="/validate"
              className={({ isActive, isPending }) =>
                isPending
                  ? pendingStyle
                  : isActive
                  ? activeStyle
                  : inactiveStyle
              }
            >
              Continue Upload
            </NavLink>
          </button>
            </div>*/}
    </Form>
  );
}
