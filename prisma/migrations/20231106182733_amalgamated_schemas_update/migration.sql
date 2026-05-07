-- CreateTable
CREATE TABLE "isMetadata" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isTrue" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "isMetadata_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "isImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isTrue" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "isImage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "isValidate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isTrue" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "isValidate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "previousUpload" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "baseURI" TEXT NOT NULL,
    "imageURI" TEXT NOT NULL,
    "numFiles" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "previousUpload_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "fileNameObject" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fileName" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "fileNameObject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "previousUpload" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "isMetadata_userId_key" ON "isMetadata"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "isImage_userId_key" ON "isImage"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "isValidate_userId_key" ON "isValidate"("userId");
