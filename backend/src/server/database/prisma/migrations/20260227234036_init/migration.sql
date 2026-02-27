-- CreateEnum
CREATE TYPE "process_priority" AS ENUM ('Alta', 'Media', 'Baixa');

-- CreateEnum
CREATE TYPE "process_type" AS ENUM ('Sistemico', 'Manual');

-- CreateEnum
CREATE TYPE "process_status" AS ENUM ('Planejado', 'Em_Andamento', 'Concluido', 'Cancelado');

-- CreateTable
CREATE TABLE "areas" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "processes" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "type" "process_type" NOT NULL DEFAULT 'Manual',
    "status" "process_status" NOT NULL DEFAULT 'Planejado',
    "priority" "process_priority" NOT NULL DEFAULT 'Media',
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "area_id" TEXT NOT NULL,
    "parent_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "processes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tools" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "process_id" TEXT NOT NULL,

    CONSTRAINT "tools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "responsibles" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "role" VARCHAR(255),
    "process_id" TEXT NOT NULL,

    CONSTRAINT "responsibles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "url" TEXT,
    "process_id" TEXT NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "areas_name_key" ON "areas"("name");

-- CreateIndex
CREATE INDEX "processes_area_id_idx" ON "processes"("area_id");

-- CreateIndex
CREATE INDEX "processes_parent_id_idx" ON "processes"("parent_id");

-- CreateIndex
CREATE INDEX "tools_process_id_idx" ON "tools"("process_id");

-- CreateIndex
CREATE INDEX "responsibles_process_id_idx" ON "responsibles"("process_id");

-- CreateIndex
CREATE INDEX "documents_process_id_idx" ON "documents"("process_id");

-- AddForeignKey
ALTER TABLE "processes" ADD CONSTRAINT "processes_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processes" ADD CONSTRAINT "processes_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "processes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tools" ADD CONSTRAINT "tools_process_id_fkey" FOREIGN KEY ("process_id") REFERENCES "processes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responsibles" ADD CONSTRAINT "responsibles_process_id_fkey" FOREIGN KEY ("process_id") REFERENCES "processes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_process_id_fkey" FOREIGN KEY ("process_id") REFERENCES "processes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
