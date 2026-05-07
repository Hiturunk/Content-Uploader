/*
  Warnings:

  - Added the required column `provider` to the `apiKey` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_apiKey" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "provider" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "apiKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_apiKey" ("createdAt", "id", "key", "updatedAt", "userId") SELECT "createdAt", "id", "key", "updatedAt", "userId" FROM "apiKey";
DROP TABLE "apiKey";
ALTER TABLE "new_apiKey" RENAME TO "apiKey";
CREATE UNIQUE INDEX "apiKey_provider_key" ON "apiKey"("provider");
CREATE UNIQUE INDEX "apiKey_key_key" ON "apiKey"("key");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
