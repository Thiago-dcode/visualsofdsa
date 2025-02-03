-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "avatar" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataStructure" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "enable" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT NOT NULL,
    "description" TEXT,
    "dataStructureTypeId" INTEGER NOT NULL,
    "dataStructureImplementationId" INTEGER,

    CONSTRAINT "DataStructure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataStructureType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "enable" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT NOT NULL,

    CONSTRAINT "DataStructureType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataStructureImplementation" (
    "id" SERIAL NOT NULL,
    "javaScript" TEXT,
    "java" TEXT,

    CONSTRAINT "DataStructureImplementation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Algorithm" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "enable" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT NOT NULL,
    "description" TEXT,
    "algorithmTypeId" INTEGER NOT NULL,
    "algorithmImplementationId" INTEGER,

    CONSTRAINT "Algorithm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlgorithmType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "enable" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AlgorithmType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlgorithmImplementation" (
    "id" SERIAL NOT NULL,
    "javaScript" TEXT,
    "java" TEXT,

    CONSTRAINT "AlgorithmImplementation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "DataStructure_name_key" ON "DataStructure"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DataStructureType_name_key" ON "DataStructureType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Algorithm_name_key" ON "Algorithm"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AlgorithmType_name_key" ON "AlgorithmType"("name");

-- AddForeignKey
ALTER TABLE "DataStructure" ADD CONSTRAINT "DataStructure_dataStructureImplementationId_fkey" FOREIGN KEY ("dataStructureImplementationId") REFERENCES "DataStructureImplementation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataStructure" ADD CONSTRAINT "DataStructure_dataStructureTypeId_fkey" FOREIGN KEY ("dataStructureTypeId") REFERENCES "DataStructureType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Algorithm" ADD CONSTRAINT "Algorithm_algorithmImplementationId_fkey" FOREIGN KEY ("algorithmImplementationId") REFERENCES "AlgorithmImplementation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Algorithm" ADD CONSTRAINT "Algorithm_algorithmTypeId_fkey" FOREIGN KEY ("algorithmTypeId") REFERENCES "AlgorithmType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
