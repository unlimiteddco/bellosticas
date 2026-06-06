import type { Block, Section } from "./types";

export function LegalSection({ section }: { section: Section }) {
  return (
    <section
      id={section.id}
      className="scroll-mt-32 flex flex-col gap-4 pb-2 border-b border-[var(--color-text)]/8 last:border-b-0"
    >
      <h2 className="font-display italic text-[26px] md:text-[32px] leading-[1.15] text-[var(--color-text)]">
        {section.title}
      </h2>

      <div className="flex flex-col gap-4 max-w-[760px]">
        {section.blocks.map((block, i) => (
          <BlockRenderer key={i} block={block} />
        ))}
      </div>
    </section>
  );
}

function BlockRenderer({ block }: { block: Block }) {
  if ("p" in block) {
    return (
      <p className="font-body text-[15px] lg:text-[16px] leading-[1.7] text-[var(--color-text-muted)]">
        {block.p}
      </p>
    );
  }

  if ("ul" in block) {
    return (
      <ul className="flex flex-col gap-2 pl-5">
        {block.ul.map((item, i) => (
          <li
            key={i}
            className="relative font-body text-[15px] lg:text-[16px] leading-[1.7] text-[var(--color-text-muted)] before:content-['—'] before:absolute before:-left-5 before:text-[var(--color-accent)]"
          >
            {item}
          </li>
        ))}
      </ul>
    );
  }

  if ("table" in block) {
    const { headers, rows } = block.table;
    return (
      <div className="overflow-x-auto -mx-1 my-2 max-w-full">
        <table className="min-w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[var(--color-text)]/15">
              {headers.map((h) => (
                <th
                  key={h}
                  className="font-body uppercase text-[10px] text-[var(--color-text-muted)] py-2.5 pr-4 align-top whitespace-nowrap"
                  style={{ letterSpacing: "0.16em" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className="border-b border-[var(--color-text)]/5 last:border-b-0"
              >
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className="font-body text-[13px] lg:text-[14px] text-[var(--color-text)] py-3 pr-4 align-top leading-[1.55]"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return null;
}
