/*
  Warnings:

  - You are about to drop the `consolidado` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "consolidado";

-- CreateTable
CREATE TABLE "Consolidado" (
    "codigo" TEXT NOT NULL,
    "fuente" TEXT,
    "marca" TEXT,
    "width" DOUBLE PRECISION,
    "aspect_ratio" TEXT,
    "construction" TEXT,
    "diameter" TEXT,
    "modelo" TEXT,
    "rango_carga" TEXT,
    "rango_velocidad" TEXT,
    "runflat" TEXT,
    "uso" TEXT,
    "capas" TEXT,
    "may" DOUBLE PRECISION,
    "exist" DOUBLE PRECISION,
    "fuente_imagen" TEXT,

    CONSTRAINT "Consolidado_pkey" PRIMARY KEY ("codigo")
);

-- CreateIndex
CREATE UNIQUE INDEX "Consolidado_codigo_key" ON "Consolidado"("codigo");
