import type {
  Note,
  User,
  fileNameObject,
  isImage,
  isMetadata,
  previousUpload,
} from "@prisma/client";
import { prisma } from "~/db.server";

export function updateUserEmail({
  userId,
  newEmail,
}: {
  userId: User["id"];
  newEmail: string;
}) {
  return prisma.user.update({
    where: { id: userId },
    data: { email: newEmail },
  });
}

export function getNote({
  title,
  userId,
}: Pick<Note, "title"> & {
  userId: User["id"];
}) {
  return prisma.note.findFirst({
    select: { id: true, body: true, title: true },
    where: { title, userId },
  });
}

//This function is used to return all the user details from the database
export async function getUserDetails(userId: string) {
  const userDetails = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      notes: true,
      isMetadata: true,
      isImage: true,
      isValidate: true,
      isUpload: true,
      previousUpload: true,
      isStorage: true,
      apiKeys: true,
      // ... include other relations if necessary
    },
  });

  const userWithAllRelations = userDetails ?? null;

  return userWithAllRelations;
}

export async function setIsMetadata(
  userId: string,
  isTrue: boolean
): Promise<isMetadata> {
  return prisma.isMetadata.upsert({
    where: { userId },
    update: { isTrue },
    create: {
      isTrue,
      user: { connect: { id: userId } },
    },
  });
}

export async function deleteIsMetadata(
  userId: string
): Promise<isMetadata | null> {
  return prisma.isMetadata
    .delete({
      where: { userId },
    })
    .catch(() => null); // Return null if not found
}

export async function setIsImage(
  userId: string,
  isTrue: boolean
): Promise<isImage> {
  return prisma.isImage.upsert({
    where: { userId },
    update: { isTrue },
    create: {
      isTrue,
      user: { connect: { id: userId } },
    },
  });
}

export async function deleteIsImage(userId: string): Promise<isImage | null> {
  return prisma.isImage
    .delete({
      where: { userId },
    })
    .catch(() => null); // Return null if not found
}

export async function addPreviousUpload(
  name: string,
  userId: string,
  baseURI: string,
  imageURI: string,
  fileNames: fileNameObject[],
  numFiles: number
): Promise<previousUpload> {
  return prisma.previousUpload.create({
    data: {
      name,
      baseURI,
      imageURI,
      numFiles,
      fileNames: {
        create: fileNames, // Assuming fileNames is an array of objects with the necessary fields
      },
      user: { connect: { id: userId } },
    },
  });
}

export async function deletePreviousUpload(
  previousUploadId: string
): Promise<previousUpload | null> {
  return prisma.previousUpload
    .delete({
      where: { id: previousUploadId },
    })
    .catch((error) => {
      // You can log the error or handle it as needed for your application context
      console.error("Failed to delete previous upload:", error);
      return null; // Return null if there was an error (e.g., record not found)
    });
}

export async function getPreviousUploads(
  userId: string
): Promise<previousUpload[]> {
  return prisma.previousUpload.findMany({
    where: { userId },
    include: {
      fileNames: true, // Assuming you want to include the related FileNameObject records
    },
  });
}

export function getDirectory(userId: string): Promise<string> {
  return prisma.user
    .findFirst({
      select: { directory: true },
      where: { id: userId },
    })
    .then((user) => user?.directory ?? "");
}

export function getNoteListItems({ userId }: { userId: User["id"] }) {
  return prisma.note.findMany({
    where: { userId },
    select: { id: true, title: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createNote({
  body,
  title,
  userId,
}: Pick<Note, "body" | "title"> & {
  userId: User["id"];
}) {
  return prisma.note.create({
    data: {
      title,
      body,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deleteNote({
  title,
  userId,
}: Pick<Note, "title"> & { userId: User["id"] }) {
  return prisma.note.deleteMany({
    where: { title, userId },
  });
}

// Add a new function to get a specific API key for a user from the database
export async function getApiKey(
  userId: User["id"],
  provider: string
): Promise<string | null> {
  const user = await prisma.user.findFirst({
    select: { apiKeys: true },
    where: { id: userId },
  });
  let key = null;
  if (user && user.apiKeys) {
    const apiKey = user.apiKeys.find((apiKey) => apiKey.provider === provider);
    key = apiKey ? apiKey.key : null;
  }
  return key;
}

// Add a new function to write a specific API key for a user in the database
export async function writeApiKey(
  userId: User["id"],
  provider: string,
  apiKey: string
) {
  const existingApiKey = await prisma.apiKey.findFirst({
    where: { userId, provider },
  });

  if (existingApiKey) {
    // If an API key for this provider already exists, update it
    return prisma.apiKey.update({
      where: { id: existingApiKey.id },
      data: { key: apiKey },
    });
  } else {
    // If no API key for this provider exists, create a new one
    return prisma.apiKey.create({
      data: { userId, provider, key: apiKey },
    });
  }
}

export async function setSelectedProvider(
  userId: User["id"],
  provider: string
) {
  return prisma.user.update({
    where: { id: userId },
    data: { selectedProvider: provider },
  });
}

export async function getSelectedProvider(userId: User["id"]) {
  const user = await prisma.user.findFirst({
    select: { selectedProvider: true },
    where: { id: userId },
  });

  return user?.selectedProvider || "";
}

export async function hasSelectedProvider(userId: User["id"]) {
  const user = await prisma.user.findFirst({
    select: { selectedProvider: true },
    where: { id: userId },
  });

  return Boolean(user?.selectedProvider);
}

export async function getLatestUploadBaseURI(userId: User["id"]) {
  const latestUpload = await prisma.previousUpload.findFirst({
    where: { userId: userId },
    orderBy: { createdAt: "desc" },
    select: { baseURI: true },
  });

  return latestUpload?.baseURI || "";
}
export async function setIsValidated(userId: User["id"], isValidated: boolean) {
  const existingIsValidated = await prisma.isValidate.findUnique({
    where: { userId: userId },
  });

  if (existingIsValidated) {
    await prisma.isValidate.update({
      where: { id: existingIsValidated.id },
      data: { isTrue: isValidated },
    });
  } else {
    await prisma.isValidate.create({
      data: {
        isTrue: isValidated,
        user: { connect: { id: userId } },
      },
    });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user;
}

export async function setIsUpload(userId: User["id"], isUpload: boolean) {
  const existingIsUpload = await prisma.isUpload.findUnique({
    where: { userId: userId },
  });

  if (existingIsUpload) {
    await prisma.isUpload.update({
      where: { id: existingIsUpload.id },
      data: { isTrue: isUpload },
    });
  } else {
    await prisma.isUpload.create({
      data: {
        isTrue: isUpload,
        user: { connect: { id: userId } },
      },
    });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user;
}

export async function setIsStorage(userId: User["id"], isStorage: boolean) {
  const existingIsStorage = await prisma.isStorage.findUnique({
    where: { userId: userId },
  });

  if (existingIsStorage) {
    await prisma.isStorage.update({
      where: { id: existingIsStorage.id },
      data: { isTrue: isStorage },
    });
  } else {
    await prisma.isStorage.create({
      data: {
        isTrue: isStorage,
        user: { connect: { id: userId } },
      },
    });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user;
}
