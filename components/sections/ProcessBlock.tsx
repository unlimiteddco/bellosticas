import { ProcessV2 } from "./ProcessV2";
import { ClientPortalContent } from "./ClientPortalContent";
import { ClientPortalMockup } from "./ClientPortalMockup";

/**
 * Cómo es trabajar con el estudio, en un solo bloque.
 *
 * Antes eran dos secciones seguidas —los tres primeros días y el portal— que
 * contaban la misma cosa por separado. Ahora van sobre el mismo fondo: arriba
 * cómo se arranca y, dentro de una tarjeta, dónde se sigue el proyecto después.
 */
export function ProcessBlock() {
  return (
    <div className="relative overflow-hidden bg-[var(--color-surface-2)]">
      {/* Trama de puntos que se desvanece hacia los bordes */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(29,29,27,0.09) 1px, transparent 1.2px)",
          backgroundSize: "20px 20px",
          maskImage: "radial-gradient(ellipse 85% 75% at 50% 50%, #000 50%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 85% 75% at 50% 50%, #000 50%, transparent 100%)",
        }}
      />
      <ProcessV2 />
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 pb-16 lg:pb-24">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg)] p-7 md:p-10 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <ClientPortalContent />
          <ClientPortalMockup />
        </div>
      </div>
    </div>
  );
}
