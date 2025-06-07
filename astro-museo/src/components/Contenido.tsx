import { useState } from "react";
import useSWR from "swr";

interface Obra {
  id: number;
  titulo: string;
  imagen: string | null;
  descripcion: string;
  procedencia: string;
  comentario: string | null;
}

const API_BASE =
  import.meta.env.PUBLIC_API_BASE !== undefined
    ? import.meta.env.PUBLIC_API_BASE
    : "";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Error ${res.status}: ${await res.text()}`);
  }
  return res.json();
};

export default function Contenido() {
  const [pagina, setPagina] = useState(0);
  const pageSize = 12;

  const { data: countData, error: countError } = useSWR(
    `${API_BASE}/api/obra/cuantas`,
    fetcher
  );

  const desde = pagina * pageSize;
  const hasta = desde + pageSize;
  const { data: obrasData, error: obrasError } = useSWR(
    () => `${API_BASE}/api/obra?desde=${desde}&hasta=${hasta}`,
    fetcher
  );

  if (countError || obrasError)
    return (
      <div className="p-4 text-red-600">
        Ha ocurrido un error al cargar las obras.
      </div>
    );

  if (!countData || !obrasData) return <div className="p-4">Cargando obras…</div>;

  const totalObras: number =
    countData.count ?? (countData.data?.count as number);
  const obras: Obra[] = obrasData.data ?? obrasData;
  const totalPages = Math.ceil(totalObras / pageSize);

  return (
    <div className="p-4" id="coleccion">
      <h2 className="text-xl font-bold mb-4">Colección de Obras</h2>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {obras.map((obra) => (
          <li
            key={obra.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow flex flex-col"
          >
            <img
              src={obra.imagen || "/images/logo.png"}
              alt={obra.titulo}
              className="h-48 w-full object-cover"
            />
            <div className="p-4 flex-1 flex flex-col space-y-2">
              <h3 className="text-lg font-semibold">{obra.titulo}</h3>
              <p className="text-sm text-gray-600">{obra.procedencia}</p>
              <p className="text-sm line-clamp-3">{obra.descripcion}</p>
              <a
                href={`/obra/${obra.id}`}
                className="mt-auto inline-block px-3 py-2 bg-purple-600 text-white rounded-lg text-sm text-center hover:bg-purple-700"
              >
                Ver detalles
              </a>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex justify-center gap-3 text-sm">
        <button
          disabled={pagina === 0}
          onClick={() => setPagina((p) => Math.max(p - 1, 0))}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50 hover:bg-gray-300"
        >
          ← Anterior
        </button>
        <span>
          Página {pagina + 1} de {totalPages}
        </span>
        <button
          disabled={pagina + 1 >= totalPages}
          onClick={() => setPagina((p) => Math.min(p + 1, totalPages - 1))}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50 hover:bg-gray-300"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}
