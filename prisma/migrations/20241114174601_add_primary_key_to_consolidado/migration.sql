-- CreateTable
CREATE TABLE "consolidado" (
    "codigo" VARCHAR(100) NOT NULL,
    "fuente" VARCHAR(100),
    "marca" VARCHAR(100),
    "width" DECIMAL,
    "aspect_ratio" VARCHAR(100),
    "construction" VARCHAR(100),
    "diameter" DECIMAL,
    "descripcion" TEXT,
    "rango_carga" VARCHAR(100),
    "rango_velocidad" VARCHAR(100),
    "runflat" VARCHAR(100),
    "uso" VARCHAR(100),
    "capas" DECIMAL,
    "may" DECIMAL,
    "exist" DECIMAL,

    CONSTRAINT "consolidado_pkey" PRIMARY KEY ("codigo")
);
