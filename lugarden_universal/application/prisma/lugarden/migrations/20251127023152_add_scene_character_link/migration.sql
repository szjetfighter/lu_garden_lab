-- CreateTable
CREATE TABLE "MaoxiaodouSceneCharacterLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sceneId" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "universeId" TEXT NOT NULL,
    CONSTRAINT "MaoxiaodouSceneCharacterLink_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "MaoxiaodouScene" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MaoxiaodouSceneCharacterLink_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "MaoxiaodouCharacter" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MaoxiaodouSceneCharacterLink_universeId_fkey" FOREIGN KEY ("universeId") REFERENCES "Universe" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "MaoxiaodouSceneCharacterLink_sceneId_characterId_key" ON "MaoxiaodouSceneCharacterLink"("sceneId", "characterId");
