import { Logo } from "@/components/ui/Logo";
import { V2Root } from "@/components/v2/V2Root";

/** Cabecera y pie de las páginas de después de comprar (gracias y descarga). */
export function MarcoTienda({ children }: { children: React.ReactNode }) {
  return (
    <V2Root>
      <div className="flex min-h-dvh flex-col">
        <header className="border-b border-[var(--v2-line)]">
          <div className="v2-frame">
            <div className="flex h-[60px] items-center justify-center px-6">
              <a href="/" aria-label="Bellostas Studio">
                <span className="v2-solo-claro">
                  <Logo variant="black" height={20} priority />
                </span>
                <span className="v2-solo-oscuro">
                  <Logo variant="blanco-rojo" height={20} priority />
                </span>
              </a>
            </div>
          </div>
        </header>
        <main className="v2-frame flex flex-1 items-start justify-center px-6 py-12 lg:py-20">
          <div className="w-full max-w-[560px]">{children}</div>
        </main>
        <footer className="border-t border-[var(--v2-line)]">
          <p className="px-6 py-5 text-center text-[12.5px] text-[var(--v2-muted)]">
            ¿Algún problema? Escribe a info@bellostas.studio
          </p>
        </footer>
      </div>
    </V2Root>
  );
}
