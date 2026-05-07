import type { User } from "@prisma/client";

interface Image {
  id: string;
  isTrue: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

interface Metadata {
  id: string;
  isTrue: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

interface Validate {
  id: string;
  isTrue: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

interface Storage {
  id: string;
  isTrue: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

interface fileNameObject {
  id: string;
  fileName: string;
  createdAt: Date;
  updatedAt: Date;
  previousUploadId: string;
}

interface PreviousUpload {
  id: string;
  baseURI: string;
  imageURI: string;
  numFiles: number;
  filenames: fileNameObject[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

interface ApiKey {
  id: string;
  key: string;
  provider: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

interface ApiKeys {
  id: string;
  apiKeys: Array<ApiKey>;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

// Define other relation interfaces as needed...

export interface UserWithAllRelations extends User {
  isImage: Image | null;
  isMetadata: Metadata | null;
  isValidate: Validate | null;
  isStorage: Storage | null;
  previousUpload: PreviousUpload[] | null;
  apiKeys: ApiKeys[] | null;

  // Include other relations as needed...
}
