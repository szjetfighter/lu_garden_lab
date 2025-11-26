-- CreateTable
CREATE TABLE "MaoxiaodouStanza" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "poemId" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "universeId" TEXT NOT NULL,
    CONSTRAINT "MaoxiaodouStanza_poemId_fkey" FOREIGN KEY ("poemId") REFERENCES "MaoxiaodouPoem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MaoxiaodouStanza_universeId_fkey" FOREIGN KEY ("universeId") REFERENCES "Universe" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MaoxiaodouStanzaSceneLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "stanzaId" TEXT NOT NULL,
    "sceneId" TEXT NOT NULL,
    "confidence" TEXT,
    "reason" TEXT,
    "universeId" TEXT NOT NULL,
    CONSTRAINT "MaoxiaodouStanzaSceneLink_stanzaId_fkey" FOREIGN KEY ("stanzaId") REFERENCES "MaoxiaodouStanza" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MaoxiaodouStanzaSceneLink_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "MaoxiaodouScene" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MaoxiaodouStanzaSceneLink_universeId_fkey" FOREIGN KEY ("universeId") REFERENCES "Universe" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "MaoxiaodouStanza_poemId_index_key" ON "MaoxiaodouStanza"("poemId", "index");

-- CreateIndex
CREATE UNIQUE INDEX "MaoxiaodouStanzaSceneLink_stanzaId_sceneId_key" ON "MaoxiaodouStanzaSceneLink"("stanzaId", "sceneId");
