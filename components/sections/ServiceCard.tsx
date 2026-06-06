"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { Link } from "@/navigation";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/lib/services";
import { useTranslations } from "next-intl";

type Props = {
  service: Service;
  index: number;
};

export function ServiceCard({ service, index }: Props) {
  const t = useTranslations("services");
  const tItems = useTranslations("services.items");
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const ySpring = useSpring(y, { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) / 12);
    y.set((e.clientY - cy) / 12);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const inner = (
    <motion.div
      style={{ x: xSpring, y: ySpring }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: "easeOut" }}
      whileHover={{ scale: 1.01 }}
      className="group relative flex flex-col gap-6 border border-[var(--color-border)] rounded-2xl p-8 bg-[var(--color-surface)] transition-colors duration-300 hover:border-[var(--color-accent)] h-full"
    >
      {(service.featured || service.hasPage) && (
        <div className="absolute top-4 right-4 flex items-center gap-3">
          {service.featured && (
            <span
              className="font-body text-[10px] font-medium uppercase text-[var(--color-accent)] flex items-center gap-1.5 whitespace-nowrap"
              style={{ letterSpacing: "0.18em" }}
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
              {t("featured")}
            </span>
          )}

          {service.hasPage && (
            <span
              className="flex items-center justify-center w-7 h-7 rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)] group-hover:border-[var(--color-accent)] group-hover:text-[var(--color-accent)] transition-colors shrink-0"
              aria-hidden
            >
              <ArrowUpRight size={14} />
            </span>
          )}
        </div>
      )}

      <span className="font-display italic text-[48px] leading-none text-[var(--color-text-muted)] transition-colors duration-300 group-hover:text-[var(--color-accent)]">
        {service.number}
      </span>

      <div className="flex flex-col gap-3 flex-1">
        <h3 className="font-body font-semibold text-[22px] leading-tight text-[var(--color-text)] transition-colors duration-300 group-hover:text-[var(--color-accent)]">
          {tItems(`${service.titleKey}.title`)}
        </h3>
        <p className="font-body text-[14px] leading-[1.5] text-[var(--color-text-muted)]">
          {tItems(`${service.titleKey}.description`)}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {service.stack.map((tech) => (
          <span
            key={tech}
            className="inline-flex items-center px-2.5 py-1 rounded-full border border-[var(--color-border)] text-[10px] uppercase text-[var(--color-text-muted)]"
            style={{ letterSpacing: "0.12em" }}
          >
            {tech}
          </span>
        ))}
      </div>
    </motion.div>
  );

  if (service.hasPage) {
    return (
      <Link
        // Runtime slug is always one of the declared service pathnames; the cast
        // just satisfies next-intl's typed Link so it localises (/servicios/…).
        href={`/services/${service.slug}` as "/services/desarrollo-web"}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 rounded-2xl"
      >
        {inner}
      </Link>
    );
  }

  return inner;
}
