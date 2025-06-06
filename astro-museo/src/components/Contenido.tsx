// src/components/Contenido.tsx
import { useState } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";

interface Obra {
  id: number;
  titulo: string;
  imagen: string;
  descripcion: string;
  procedencia: string;
  comentario: string | null;
}

// Función fetcher para SWR (retorna el JSON)
const fetcher = (url: string) =>
  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error("Error en la petición");
      return res.json();
    })
    .then((data) => data);

export default function Contenido() {
  // Paginación sencilla: 
  const [pagina, setPagina] = useState<number>(0);
  const pageSize = 10; // vamos a mostrar de 10 en 10

  // 1) Obtener cuántas obras hay en total
  const { data: countData, error: countError } = useSWR(
    "http://localhost:8000/api/obra/cuantas",
    fetcher
  );

  // 2) Obtener la lista de obras de la página actual
  const desde = pagina * pageSize;
  const hasta = desde + pageSize;
  const { data: obrasData, error: obrasError } = useSWR(
    () => `http://localhost:8000/api/obra?desde=${desde}&hasta=${hasta}`,
    fetcher
  );

  if (countError || obrasError) {
    return <div className="p-4 text-red-600">Error al cargar datos.</div>;
  }
  if (!countData || !obrasData) {
    return <div className="p-4">Cargando obras…</div>;
  }

  const totalObras: number = countData.count;
  const obras: Obra[] = obrasData.data; // la API devuelve { ok: true, data: [Obra, …] }

  // Calcular número de páginas
  const totalPages = Math.ceil(totalObras / pageSize);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Colección de Obras</h2>
      <p className="mb-2">
        Total de obras en el museo: <strong>{totalObras}</strong>
      </p>

      {obras.length === 0 ? (
        <div>No hay obras en esta página.</div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {obras.map((obra) => (
            <li
              key={obra.id}
              className="bg-white rounded-lg shadow overflow-hidden flex flex-col"
            >
              {/* Si la obra no tiene imagen, usa un placeholder */}
              <img
                src={obra.imagen || "/images/logo.png"}
                alt={obra.titulo}
                className="h-48 w-full object-cover"
              />
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold mb-1">{obra.titulo}</h3>
                <p className="text-sm text-gray-600 mb-2">{obra.procedencia}</p>
                <p className="text-sm flex-1">{obra.descripcion}</p>
                <div className="mt-4 text-center">
                  {/* Botón que podría llevar a /obra/[id] en una futura ruta */}
                  <Button
                    onClick={() => alert(`Ver detalles de obra ID ${obra.id}`)}
                    className="mt-auto"
                  >
                    Ver detalles
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Paginación simple */}
      <div className="mt-6 flex justify-center items-center space-x-2">
        <Button
          disabled={pagina === 0}
          onClick={() => setPagina((p) => Math.max(p - 1, 0))}
          className="px-3"
        >
          ← Anterior
        </Button>
        <span>
          Página {pagina + 1} de {totalPages}
        </span>
        <Button
          disabled={pagina + 1 >= totalPages}
          onClick={() => setPagina((p) => Math.min(p + 1, totalPages - 1))}
          className="px-3"
        >
          Siguiente →
        </Button>
      </div>
    </div>
  );
}
