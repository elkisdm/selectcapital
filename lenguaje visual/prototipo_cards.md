# Select Capital — Prototipo de Cards de Proyectos (Mock)

> Minimal, responsive. Usa Tailwind para estilos. Filtros simples + orden.  
> CTA por card: “Ver detalles” (placeholder).

```tsx
import React, { useMemo, useState } from "react";

/**
 * Select Capital — Prototipo de Cards de Proyectos (Mock)
 * - Minimal, responsive, 1 vista.
 * - Tailwind para estilos (no imports necesarios en este entorno).
 * - Filtros simples + orden.
 * - CTA único por card: "Ver detalles" (placeholder onClick).
 */

const MOCK_PROJECTS = [
  {
    id: "lofty-florida",
    nombre: "Lofty La Florida",
    comuna: "La Florida",
    estado: "En obra",
    entrega: "Q2 2026",
    rentabilidad: "6.8–7.5%",
    ticketUF: 1200,
    tesis: "Demanda por conectividad (L4), servicios y alto flujo de arriendo.",
    imagen: "linear-gradient(135deg, #111 0%, #1f2937 40%, #0ea5e9 100%)",
  },
  {
    id: "nunoa-hub",
    nombre: "Ñuñoa Hub",
    comuna: "Ñuñoa",
    estado: "En desarrollo",
    entrega: "Q4 2026",
    rentabilidad: "6.2–7.0%",
    ticketUF: 1800,
    tesis: "Mix residencial + servicios, vacancia históricamente baja.",
    imagen: "linear-gradient(135deg, #111 0%, #1f2937 40%, #22c55e 100%)",
  },
  {
    id: "independencia-centro",
    nombre: "Independencia Centro",
    comuna: "Independencia",
    estado: "Entrega inmediata",
    entrega: "Disponible",
    rentabilidad: "6.5–7.2%",
    ticketUF: 1500,
    tesis: "Cercanía a salud y educación; rotación estable de arriendo.",
    imagen: "linear-gradient(135deg, #111 0%, #1f2937 40%, #f59e0b 100%)",
  },
  {
    id: "macul-conecta",
    nombre: "Macul Conecta",
    comuna: "Macul",
    estado: "En obra",
    entrega: "Q1 2027",
    rentabilidad: "6.0–6.6%",
    ticketUF: 1100,
    tesis: "Ticket accesible + polos educativos/servicios.",
    imagen: "linear-gradient(135deg, #111 0%, #1f2937 40%, #a78bfa 100%)",
  },
];

function badgeColor(estado: string) {
  switch (estado) {
    case "Entrega inmediata":
      return "bg-emerald-500/90 text-white";
    case "En obra":
      return "bg-sky-500/90 text-white";
    case "En desarrollo":
      return "bg-amber-500/90 text-white";
    default:
      return "bg-gray-600/90 text-white";
  }
}

function parseMinYield(r: string) {
  // "6.8–7.5%" -> 6.8
  if (!r) return 0;
  const match = r.replace("%", "").split("–")[0];
  const val = parseFloat(match);
  return Number.isFinite(val) ? val : 0;
}

export default function ProjectCardsMock() {
  const [query, setQuery] = useState("");
  const [estado, setEstado] = useState("Todos");
  const [orden, setOrden] = useState("relevancia");

  const proyectos = useMemo(() => {
    let list = [...MOCK_PROJECTS];

    // filtro por búsqueda (nombre/comuna)
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) => p.nombre.toLowerCase().includes(q) || p.comuna.toLowerCase().includes(q)
      );
    }

    // filtro por estado
    if (estado !== "Todos") {
      list = list.filter((p) => p.estado === estado);
    }

    // ordenamiento
    if (orden === "ticket_asc") {
      list.sort((a, b) => a.ticketUF - b.ticketUF);
    } else if (orden === "yield_desc") {
      list.sort((a, b) => parseMinYield(b.rentabilidad) - parseMinYield(a.rentabilidad));
    } else if (orden === "entrega_asc") {
      // Disponible primero, luego por Q1/Q2/Q3/Q4 y año
      const weight = (e: string) => {
        if (e === "Disponible") return 0;
        const m = e.match(/Q(\d)\s(\d{4})/);
        if (!m) return 9999;
        return parseInt(m[2]) * 10 + parseInt(m[1]);
      };
      list.sort((a, b) => weight(a.entrega) - weight(b.entrega));
    }

    return list;
  }, [query, estado, orden]);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="mx-auto max-w-7xl px-4 py-10 md:py-12">
        {/* Header minimal */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-neutral-900" />
            <span className="text-lg font-semibold tracking-tight">Select Capital</span>
            <span className="ml-3 rounded-full bg-black/5 px-2.5 py-1 text-xs font-medium text-neutral-600">Mock data</span>
          </div>
          <div className="text-xs text-neutral-500">Prototipo de cards · v0.1</div>
        </div>

        {/* Título + controles */}
        <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Proyectos destacados</h1>
            <p className="mt-1 text-sm text-neutral-600">Curaduría por demanda de arriendo, conectividad y riesgo controlado.</p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative">
              <input
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none ring-0 placeholder:text-neutral-400 focus:border-neutral-400 md:w-64"
                placeholder="Buscar por nombre o comuna"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <select
              className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm focus:border-neutral-400"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            >
              <option>Todos</option>
              <option>Entrega inmediata</option>
              <option>En obra</option>
              <option>En desarrollo</option>
            </select>

            <select
              className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm focus:border-neutral-400"
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
            >
              <option value="relevancia">Ordenar por: Relevancia</option>
              <option value="ticket_asc">Ticket (UF) ↑</option>
              <option value="yield_desc">Rentabilidad ↓</option>
              <option value="entrega_asc">Entrega ↑</option>
            </select>
          </div>
        </div>

        {/* Grid de cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {proyectos.map((p) => (
            <article key={p.id} className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md">
              {/* Imagen mock */}
              <div className="relative h-44 w-full">
                <div
                  className="absolute inset-0"
                  style={{ background: p.imagen }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium ${badgeColor(p.estado)}`}>
                  {p.estado}
                </span>
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div className="max-w-[75%]">
                    <h3 className="truncate text-lg font-semibold text-white drop-shadow-sm">{p.nombre}</h3>
                    <p className="mt-0.5 text-sm text-white/85">{p.comuna}</p>
                  </div>
                  <div className="rounded-xl bg-white/90 px-3 py-1.5 text-right">
                    <p className="text-[10px] uppercase tracking-wide text-neutral-500">Rentab.</p>
                    <p className="text-sm font-semibold text-neutral-900">{p.rentabilidad}</p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-4">
                <ul className="grid grid-cols-3 gap-2 text-sm">
                  <li className="rounded-lg bg-neutral-50 px-3 py-2">
                    <p className="text-[10px] uppercase tracking-wide text-neutral-500">Ticket desde</p>
                    <p className="font-semibold">UF {p.ticketUF.toLocaleString("es-CL")}</p>
                  </li>
                  <li className="rounded-lg bg-neutral-50 px-3 py-2">
                    <p className="text-[10px] uppercase tracking-wide text-neutral-500">Entrega</p>
                    <p className="font-semibold">{p.entrega}</p>
                  </li>
                  <li className="rounded-lg bg-neutral-50 px-3 py-2">
                    <p className="text-[10px] uppercase tracking-wide text-neutral-500">Demanda</p>
                    <p className="font-semibold">Alta</p>
                  </li>
                </ul>

                <p className="mt-3 line-clamp-2 text-sm text-neutral-600">{p.tesis}</p>

                <div className="mt-4 flex items-center justify-between">
                  <button
                    onClick={() => alert(`Ver detalles: ${p.nombre}`)}
                    className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 active:scale-[.99]"
                  >
                    Ver detalles
                  </button>
                  <div className="text-xs text-neutral-500">ID: {p.id}</div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Cierre */}
        <div className="mt-10 flex items-center justify-between">
          <p className="text-sm text-neutral-500">Estos son datos simulados para efectos de diseño y flujo.</p>
          <button
            onClick={() => alert("Cargar más (mock)")}
            className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:border-neutral-400"
          >
            Cargar más
          </button>
        </div>
      </div>
    </div>
  );
}
