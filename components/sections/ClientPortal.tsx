import { ClientPortalContent } from "./ClientPortalContent";
import { ClientPortalMockup } from "./ClientPortalMockup";

export function ClientPortal() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-surface-2)]">
      {/* Dot grid texture — fades out toward the edges */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(29,29,27,0.09) 1px, transparent 1.2px)",
          backgroundSize: "20px 20px",
          maskImage:
            "radial-gradient(ellipse 85% 75% at 50% 50%, #000 50%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 85% 75% at 50% 50%, #000 50%, transparent 100%)",
        }}
      />
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <ClientPortalContent />
          <ClientPortalMockup />
        </div>
      </div>
    </section>
  );
}
