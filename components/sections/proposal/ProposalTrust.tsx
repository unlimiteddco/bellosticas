import { GoogleG, Star } from "@/components/ui/GoogleReviewBadge";

/**
 * Prueba social en el menú lateral: acompaña al cliente durante toda la
 * lectura, incluida la parte del precio.
 *
 * Solo la valoración de Google: la escribieron otros, es verificable y no
 * hace falta defenderla. Una cifra propia ("+70 proyectos") se lee como
 * relleno y encima invita a que te la pregunten.
 */
export function ProposalTrust({
  ratingValue,
  ratingLabel,
}: {
  ratingValue: string;
  ratingLabel: string;
}) {
  return (
    <div className="mt-6 pt-6 border-t border-[var(--color-text)]/12">
      <div className="flex items-center gap-2.5">
        <GoogleG size={20} />
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-body text-[14px] font-medium text-[var(--color-text)] tabular-nums">
              {ratingValue}
            </span>
            <span className="flex items-center gap-px" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={11} />
              ))}
            </span>
          </div>
          <span className="block font-body text-[11px] text-[var(--color-text-muted)] leading-tight mt-0.5">
            {ratingLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
