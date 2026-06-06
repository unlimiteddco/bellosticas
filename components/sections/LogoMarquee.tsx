import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { Reveal } from "@/components/ui/Reveal";

type Logo = {
  name: string;
  src: string;
  /** Per-logo scale factor to balance visual weight. Default = 1 */
  scale?: number;
};

// Base height for the marquee. Per-logo `scale` adjusts each individually.
const BASE_HEIGHT = 56; // px (was h-14)

const CLIENTS: Logo[] = [
  { name: "Social11", src: "/client-logos/logo-social11-footer.svg", scale: 0.78 },
  { name: "FADA", src: "/client-logos/fada-web.svg" },
  { name: "Como me lo como", src: "/client-logos/comomelocomo.svg" },
  {
    name: "Embroidery Download",
    src: "/client-logos/embroideydownload.svg",
    scale: 1.3,
  },
  { name: "Teleadhesivo", src: "/client-logos/logo-teleadhesivo-tablet.svg" },
  { name: "Noal Design", src: "/client-logos/noal-design-hero-1.svg", scale: 1.2 },
];

export function LogoMarquee() {
  // Duplicate the array so the marquee loops seamlessly
  const items = [...CLIENTS, ...CLIENTS];

  return (
    <section className="relative z-10 border-t border-b border-[var(--color-border)] py-12 overflow-hidden">
      <Reveal className="px-6 lg:px-12 mb-6">
        <EditorialLabel>// TRUSTED BY</EditorialLabel>
      </Reveal>

      <div
        className="relative w-full overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)",
        }}
      >
        <div className="bs-marquee-track flex items-center gap-14 lg:gap-16 whitespace-nowrap py-2">
          {items.map((logo, i) => {
            const h = Math.round(BASE_HEIGHT * (logo.scale ?? 1));
            return (
              <div
                key={`${logo.name}-${i}`}
                className="bs-logo-cell flex items-center justify-center shrink-0"
                style={{ height: BASE_HEIGHT }}
              >
                <img
                  src={logo.src}
                  alt={logo.name}
                  className="block w-auto max-w-[260px] object-contain"
                  style={{ height: h }}
                  draggable={false}
                />
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes bs-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .bs-marquee-track {
          width: max-content;
          animation: bs-marquee 42s linear infinite;
        }
        .bs-logo-cell {
          opacity: 0.9;
          transform: scale(1);
          transition: opacity 400ms ease-out, transform 400ms ease-out;
        }
        .bs-logo-cell:hover {
          opacity: 1;
          transform: scale(1.05);
        }
        @media (prefers-reduced-motion: reduce) {
          .bs-marquee-track { animation: none; }
        }
      `}</style>
    </section>
  );
}
