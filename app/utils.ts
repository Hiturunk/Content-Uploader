import { useMatches } from "@remix-run/react";
import fs from "fs";
import path from "path";
import { useMemo } from "react";
import type { User } from "~/models/user.server";
import os from "os";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

const DEFAULT_REDIRECT = "/";

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT
) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }

  return to;
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
  id: string
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );
  return route?.data as Record<string, unknown> | undefined;
}

function isUser(user: any): user is User {
  return user && typeof user === "object" && typeof user.email === "string";
}

export function useOptionalUser(): User | undefined {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser(): User {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
    );
  }
  return maybeUser;
}

export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}

export function getUploadsDirectory(
  directoryName: string,
  NODE_ENV: string = "production"
) {
  console.log({ NODE_ENV, CI: process.env.CI });

  if (process.env.CI) {
    return `${os.tmpdir()}/${directoryName}/`;
  }

  if (NODE_ENV === "production") {
    return `/data/uploads/${directoryName}/`;
  }

  const tempDir = path.join(__dirname, "../public/tempdata");

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
    console.log(`Directory created: ${tempDir}`);
  }

  return path.join(tempDir, directoryName) + "/";
}

export function randomId(length: number) {
  return Math.random()
    .toString(36)
    .substring(2, length + 2);
}
// check if the id matches any other existing ids provided as an array
export function checkId(id: string, existing: string[]): boolean {
  let match = existing.find(function (item) {
    return item === id;
  });
  return match ? false : true;
}
// generate a unique id
type GetIdInput = {
  length: number;
  existing?: string[];
};

export function getId({ length, existing = [] }: GetIdInput) {
  const limit = 100; // max tries to create unique id
  let attempts = 0; // how many attempts
  let id: string | boolean = false;
  while (!id && attempts < limit) {
    id = randomId(length); // create id
    if (!checkId(id, existing)) {
      // check unique
      id = false; // reset id
      attempts++; // record failed attempt
    }
  }
  return id.toString(); // the id or false if did not get unique after max attempts
}

export function bytesToSize(bytes: number) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i)) + " " + sizes[i];
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}