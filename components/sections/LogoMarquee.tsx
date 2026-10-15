import { useTranslations } from "next-intl";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { Reveal } from "@/components/ui/Reveal";

type Logo = {
  name: string;
  src: string;
  /** Altura en px a la que se pinta. Ver la nota de abajo. */
  h: number;
};

/*
 * Los logos no pesan lo mismo a la vista aunque midan lo mismo: uno ancho y
 * fino parece más pequeño que uno compacto y negro. La altura de cada uno
 * está ajustada para que ocupen un área parecida —los anchos, más bajos; los
 * compactos, más altos— y los de trazo grueso un poco menos.
 *
 * Los archivos están recortados a su dibujo (sin aire dentro del propio SVG):
 * así la separación entre logos es la del `gap` y es igual entre todos. Antes
 * varios traían márgenes internos distintos y los huecos salían desiguales.
 * Al añadir un logo: recortar su viewBox al dibujo y elegir su altura aquí.
 */
export const CLIENTS: Logo[] = [
  { name: "Social11", src: "/client-logos/logo-social11-footer.svg", h: 30 },
  { name: "FADA", src: "/client-logos/fada-web.svg", h: 40 },
  { name: "GottenGym", src: "/client-logos/gottengym.svg", h: 27 },
  { name: "Embroidery Download", src: "/client-logos/embroideydownload.svg", h: 25 },
  { name: "Teleadhesivo", src: "/client-logos/logo-teleadhesivo-tablet.svg", h: 42 },
  { name: "Noal Design", src: "/client-logos/noal-design-hero-1.svg", h: 37 },
];

export function LogoMarquee() {
  const t = useTranslations("logos");
  // Duplicate the array so the marquee loops seamlessly
  const items = [...CLIENTS, ...CLIENTS];

  return (
    <section className="relative z-10 border-t border-b border-[var(--color-border)] py-8 md:py-12 overflow-hidden">
      <Reveal className="px-6 lg:px-12 mb-4 md:mb-6">
        <EditorialLabel>{t("label")}</EditorialLabel>
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
        <div className="bs-marquee-track flex items-center gap-[72px] lg:gap-[96px] pr-[72px] lg:pr-[96px] whitespace-nowrap py-2">
          {items.map((logo, i) => (
            <div key={`${logo.name}-${i}`} className="bs-logo-cell flex h-14 items-center justify-center shrink-0">
              <img
                src={logo.src}
                alt={logo.name}
                className="block w-auto object-contain grayscale opacity-60 transition-[filter,opacity] duration-300 hover:grayscale-0 hover:opacity-100"
                style={{ height: logo.h }}
                draggable={false}
              />
            </div>
          ))}
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
