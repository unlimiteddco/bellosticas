import { Logo } from "@/components/ui/Logo";
import { V2Root } from "@/components/v2/V2Root";
import { IdiomaToggle } from "@/components/v2/Toggles";

/**
 * Cabecera de las páginas de la tienda: la marca y el cambio de idioma
 * (ES · EN), bien a la vista porque media audiencia llega de fuera.
 */
export function CabeceraTienda() {
  return (
    <header className="border-b border-[var(--v2-line)]">
      <div className="v2-frame">
        <div className="flex h-[60px] items-center justify-between px-4 lg:px-10">
          <a href="/" aria-label="Bellostas Studio">
            <span className="v2-solo-claro">
              <Logo variant="black" height={20} priority />
            </span>
            <span className="v2-solo-oscuro">
              <Logo variant="blanco-rojo" height={20} priority />
            </span>
          </a>
          <div className="rounded-[8px] border border-[var(--v2-line)] p-0.5">
            <IdiomaToggle grande />
          </div>
        </div>
      </div>
    </header>
  );
}

/** Marco de las páginas de después de comprar (gracias y descarga). */
export function MarcoTienda({ children, pie }: { children: React.ReactNode; pie: string }) {
  return (
    <V2Root>
      <div className="flex min-h-dvh flex-col">
        <CabeceraTienda />
        <main className="v2-frame flex flex-1 items-start justify-center px-6 py-12 lg:py-20">
          <div className="w-full max-w-[560px]">{children}</div>
        </main>
        <footer className="border-t border-[var(--v2-line)]">
          <p className="px-6 py-5 text-center text-[12.5px] text-[var(--v2-muted)]">{pie}</p>
        </footer>
      </div>
    </V2Root>
  );
}
