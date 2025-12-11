-- CreateTable
CREATE TABLE "ShuiCollection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "dedication" TEXT,
    "dateStart" TEXT NOT NULL,
    "dateEnd" TEXT NOT NULL,
    "regions" TEXT,
    "poemCount" INTEGER NOT NULL,
    "description" TEXT,
    "universeId" TEXT NOT NULL,
    CONSTRAINT "ShuiCollection_universeId_fkey" FOREIGN KEY ("universeId") REFERENCES "Universe" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ShuiPoem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "collectionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "location" TEXT,
    "index" INTEGER NOT NULL,
    "tokens" TEXT,
    "universeId" TEXT NOT NULL,
    CONSTRAINT "ShuiPoem_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "ShuiCollection" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ShuiPoem_universeId_fkey" FOREIGN KEY ("universeId") REFERENCES "Universe" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ShuiCollection_universeId_nameEn_key" ON "ShuiCollection"("universeId", "nameEn");

-- CreateIndex
CREATE UNIQUE INDEX "ShuiPoem_universeId_collectionId_title_key" ON "ShuiPoem"("universeId", "collectionId", "title");
