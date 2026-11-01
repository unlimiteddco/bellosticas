import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowDown, BookOpen, FileArchive } from "lucide-react";
import { MarcoTienda } from "@/components/sections/tienda/MarcoTienda";
import { alCrm } from "@/lib/tienda";

/*
 * La descarga de una compra (bellostas.studio/compra/<código>). El código va
 * en el email y no caduca; los archivos son los que haya ahora en el CRM, así
 * que una versión nueva aparece aquí sola.
 */
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Tu descarga · Bellostas Studio",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

interface Compra {
  producto: string;
  email: string;
  archivos: { id: string; nombre: string; tamano: number | null }[];
}

const peso = (b: number | null) => (b === null ? "" : b > 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${Math.round(b / 1e3)} KB`);

export default async function CompraPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!/^[A-Za-z0-9_-]{16,64}$/.test(token)) notFound();
  let compra: Compra | null = null;
  try {
    const res = await alCrm(`/api/public/tienda/compras/${token}`, {});
    if (res.ok) compra = (await res.json()) as Compra;
  } catch {
    compra = null;
  }
  if (!compra) notFound();
  // La guía primero: es por donde hay que empezar.
  const esGuia = (nombre: string) => nombre.toLowerCase().endsWith(".pdf");
  compra.archivos.sort((a, b) => Number(esGuia(b.nombre)) - Number(esGuia(a.nombre)));

  return (
    <MarcoTienda>
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <span className="v2-tag">Compra confirmada</span>
          <h1 className="mt-4 text-[32px] font-medium leading-[1.1] tracking-[-0.03em] lg:text-[40px]">
            Gracias. Aquí tienes {compra.producto}
          </h1>
          <p className="mt-3 text-[15px] leading-[1.6] text-[var(--v2-muted)]">
            Te hemos mandado este mismo enlace a <strong className="text-[var(--v2-text)]">{compra.email}</strong>. Guárdalo: no
            caduca y las versiones nuevas aparecerán aquí.
          </p>
        </div>

        <ul className="v2-card divide-y divide-[var(--v2-line)] p-0">
          {compra.archivos.map((a) => {
            const guia = esGuia(a.nombre);
            const Icono = guia ? BookOpen : FileArchive;
            return (
              <li key={a.id}>
                <a
                  href={`/descargar/compra/${token}/${a.id}`}
                  className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[var(--v2-bg-2)]"
                >
                  <Icono size={20} strokeWidth={1.6} className="shrink-0 text-[var(--v2-accent)]" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15.5px] font-medium">{a.nombre}</span>
                    <span className="block text-[12.5px] text-[var(--v2-muted)]">
                      {guia ? "La guía: empieza por aquí" : "El código"} · {peso(a.tamano)}
                    </span>
                  </span>
                  <ArrowDown size={18} strokeWidth={1.8} className="shrink-0" />
                </a>
              </li>
            );
          })}
          {compra.archivos.length === 0 && (
            <li className="px-5 py-6 text-center text-[15px] text-[var(--v2-muted)]">
              Estamos preparando los archivos. Vuelve a este enlace en un rato.
            </li>
          )}
        </ul>

        <p className="text-center text-[14px] leading-[1.6] text-[var(--v2-muted)]">
          ¿Prefieres que te lo monte yo para tu club?{" "}
          <a href="/contacto" className="text-[var(--v2-text)] underline underline-offset-2">
            Escríbeme
          </a>
        </p>
      </div>
    </MarcoTienda>
  );
}
