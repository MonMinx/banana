/*
  Warnings:

  - You are about to drop the column `wechatId` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT,
    "password" TEXT,
    "credits" INTEGER NOT NULL DEFAULT 0,
    "role" TEXT NOT NULL DEFAULT 'user',
    "wechatOpenId" TEXT,
    "unionId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "credits", "email", "id", "password", "role", "updatedAt") SELECT "createdAt", "credits", "email", "id", "password", "role", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_wechatOpenId_key" ON "User"("wechatOpenId");
CREATE UNIQUE INDEX "User_unionId_key" ON "User"("unionId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
