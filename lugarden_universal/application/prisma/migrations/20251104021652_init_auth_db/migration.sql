/*
  Warnings:

  - You are about to drop the `CrossUniverseContentLink` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Emotion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MaoxiaodouCharacter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MaoxiaodouCharacterRelation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MaoxiaodouMapping` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MaoxiaodouMetadata` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MaoxiaodouPoem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MaoxiaodouReadingLayer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MaoxiaodouScene` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MaoxiaodouTerminology` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MaoxiaodouTheme` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MaoxiaodouTheory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MaoxiaodouTimeline` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Theme` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Universe` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UniverseEmotion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UniverseTheme` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ZhouMapping` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ZhouPoem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ZhouProject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ZhouQA` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ZhouSubProject` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CrossUniverseContentLink";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Emotion";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "MaoxiaodouCharacter";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "MaoxiaodouCharacterRelation";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "MaoxiaodouMapping";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "MaoxiaodouMetadata";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "MaoxiaodouPoem";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "MaoxiaodouReadingLayer";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "MaoxiaodouScene";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "MaoxiaodouTerminology";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "MaoxiaodouTheme";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "MaoxiaodouTheory";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "MaoxiaodouTimeline";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Theme";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Universe";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UniverseEmotion";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UniverseTheme";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ZhouMapping";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ZhouPoem";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ZhouProject";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ZhouQA";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ZhouSubProject";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "UserGongBiWork" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "sourcePoemId" TEXT NOT NULL,
    "mappingId" TEXT NOT NULL,
    "sourcePoemTitle" TEXT NOT NULL,
    "sourcePoemChapter" TEXT NOT NULL,
    "mappingChapter" TEXT NOT NULL,
    "mappingCombination" TEXT NOT NULL,
    "mappingMeaning" TEXT,
    "userInput" TEXT NOT NULL,
    "poemTitle" TEXT NOT NULL,
    "poemContent" TEXT NOT NULL,
    "poemQuote" TEXT,
    "poemQuoteSource" TEXT,
    "conversationId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "usageMetadata" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserGongBiWork_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "UserGongBiWork_userId_idx" ON "UserGongBiWork"("userId");

-- CreateIndex
CREATE INDEX "UserGongBiWork_createdAt_idx" ON "UserGongBiWork"("createdAt");

-- CreateIndex
CREATE INDEX "UserGongBiWork_conversationId_idx" ON "UserGongBiWork"("conversationId");
