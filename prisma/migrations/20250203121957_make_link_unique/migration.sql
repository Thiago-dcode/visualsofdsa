/*
  Warnings:

  - A unique constraint covering the columns `[link]` on the table `Algorithm` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[link]` on the table `AlgorithmType` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[link]` on the table `DataStructure` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[link]` on the table `DataStructureType` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Algorithm_link_key" ON "Algorithm"("link");

-- CreateIndex
CREATE UNIQUE INDEX "AlgorithmType_link_key" ON "AlgorithmType"("link");

-- CreateIndex
CREATE UNIQUE INDEX "DataStructure_link_key" ON "DataStructure"("link");

-- CreateIndex
CREATE UNIQUE INDEX "DataStructureType_link_key" ON "DataStructureType"("link");
