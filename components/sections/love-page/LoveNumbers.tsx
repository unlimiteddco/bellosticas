import { useTranslations } from "next-intl";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { BrandPattern } from "@/components/ui/BrandPattern";
import { NumberCounter } from "@/components/sections/NumberCounter";

const NS = "lovePage.numbers";

export function LoveNumbers() {
  const t = useTranslations(NS);
  const items = t.raw("items") as { value: string; label: string }[];

  return (
    <section className="relative bg-[var(--color-text)] overflow-hidden">
      <BrandPattern asBackground opacity={0.16} size="md" />
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <EditorialLabel className="block mb-12 text-[var(--color-bg)]/70">
          {t("label")}
        </EditorialLabel>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 md:gap-6">
          {items.map((it, i) => (
            <NumberCounter
              key={i}
              value={it.value}
              label={it.label}
              dark
            />
          ))}
        </div>
      </div>
    </section>
  );
}
