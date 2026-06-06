"use client";

type Props = {
  label: string;
  sections: { id: string; title: string }[];
};

export function LegalTOC({ label, sections }: Props) {
  return (
    <nav aria-label="Table of contents" className="flex flex-col gap-3">
      <span
        className="font-body uppercase text-[10px] text-[var(--color-text-muted)]"
        style={{ letterSpacing: "0.18em" }}
      >
        {label}
      </span>

      <ul className="flex flex-col gap-2 border-l border-[var(--color-text)]/15">
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className="block pl-4 -ml-px py-1 font-body text-[13px] leading-[1.4] text-[var(--color-text-muted)] border-l-2 border-transparent hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-colors"
            >
              {s.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
