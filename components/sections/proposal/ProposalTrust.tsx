import { GoogleG, Star } from "@/components/ui/GoogleReviewBadge";

/**
 * Prueba social en el menú lateral: acompaña al cliente durante toda la
 * lectura, incluida la parte del precio.
 *
 * Dos señales distintas a propósito: la valoración de Google la escribieron
 * otros (no la controlo yo), y el número de proyectos dice que esto no es el
 * primero. A una empresa grande le importa más lo segundo.
 */
export function ProposalTrust({
  projectsCount,
  projectsLabel,
  ratingValue,
  ratingLabel,
}: {
  projectsCount: string;
  projectsLabel: string;
  ratingValue: string;
  ratingLabel: string;
}) {
  return (
    <div className="mt-6 pt-6 border-t border-[var(--color-text)]/12 flex flex-col gap-5">
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

      <div>
        <span className="block font-display text-[26px] leading-none text-[var(--color-text)] tabular-nums">
          {projectsCount}
        </span>
        <span className="block font-body text-[11px] leading-tight text-[var(--color-text-muted)] mt-1.5">
          {projectsLabel}
        </span>
      </div>
    </div>
  );
}
