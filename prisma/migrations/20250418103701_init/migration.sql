-- CreateTable
CREATE TABLE "Obra" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "imagen" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "procedencia" TEXT NOT NULL,
    "comentario" TEXT NOT NULL,

    CONSTRAINT "Obra_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Obra_titulo_key" ON "Obra"("titulo");
