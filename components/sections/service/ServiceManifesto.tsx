"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Check } from "lucide-react";
import { EditorialLabel } from "@/components/ui/EditorialLabel";
import { MixedHeadline } from "@/components/ui/MixedHeadline";
import { MigrationWindow } from "./MigrationWindow";
import { OrdersWindow } from "./OrdersWindow";
import { WorkflowWindow } from "./WorkflowWindow";

export type ManifestoVariant = "code" | "orders" | "workflow" | "migration";

type Props = {
  label: string;
  titleParts: [string, string, string];
  body: string;
  bullets: string[];
  /** Which visualization to render on the right column. Default 'code'. */
  variant?: ManifestoVariant;
};

export function ServiceManifesto({
  label,
  titleParts,
  body,
  bullets,
  variant = "code",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Slight parallax + tilt — same treatment for all variants
  const rotateY = useTransform(scrollYProgress, [0, 1], [-4, 4]);
  const yOffset = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section
      ref={ref}
      className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 py-16 lg:py-24"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left — text */}
        <div className="lg:col-span-6 flex flex-col gap-5">
          <EditorialLabel>{label}</EditorialLabel>
          <MixedHeadline
            className="text-[40px] md:text-[56px]"
            parts={[
              { text: titleParts[0] },
              { text: titleParts[1], accent: true },
              { text: titleParts[2] },
            ]}
          />
          <p className="font-body text-[16px] lg:text-[17px] leading-[1.65] text-[var(--color-text-muted)] max-w-[520px]">
            {body}
          </p>

          <ul className="flex flex-col gap-3 mt-2">
            {bullets.map((b, i) => (
              <motion.li
                key={b}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3 font-body text-[14px] text-[var(--color-text)]"
              >
                <span className="w-5 h-5 rounded-full bg-[var(--color-accent)]/15 flex items-center justify-center shrink-0">
                  <Check
                    size={12}
                    className="text-[var(--color-accent)]"
                    strokeWidth={2.5}
                  />
                </span>
                {b}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Right — visualization */}
        <motion.div
          className="lg:col-span-6 relative"
          style={{ y: yOffset, rotateY }}
        >
          {variant === "orders" ? (
            <OrdersWindow />
          ) : variant === "workflow" ? (
            <WorkflowWindow />
          ) : variant === "migration" ? (
            <MigrationWindow />
          ) : (
            <CodeWindow />
          )}
        </motion.div>
      </div>
    </section>
  );
}

function CodeWindow() {
  return (
    <div
      className="relative rounded-2xl overflow-hidden bg-[var(--color-text)] shadow-[0_30px_60px_-20px_rgba(29,29,27,0.45)]"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[var(--color-bg)]/10">
        <span className="w-2.5 h-2.5 rounded-full bg-[#E66464]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#E6BB64]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#7BC57B]" />
        <span
          className="ml-3 font-body text-[10px] text-[var(--color-bg)]/40"
          style={{ letterSpacing: "0.04em" }}
        >
          page.tsx
        </span>
      </div>

      {/* Code */}
      <div className="p-5 md:p-6 font-mono text-[12px] md:text-[13px] leading-[1.7] text-[var(--color-bg)]/90 flex flex-col gap-0">
        <CodeLine n={1} color="muted">
          <span className="text-[#E78A9B]">export default</span>{" "}
          <span className="text-[#7BC57B]">async function</span>{" "}
          <span className="text-[#9CC4F5]">Page</span>() {`{`}
        </CodeLine>
        <CodeLine n={2}>
          {"  "}
          <span className="text-[#E78A9B]">const</span> data ={" "}
          <span className="text-[#E78A9B]">await</span> sanity.
          <span className="text-[#9CC4F5]">fetch</span>(query);
        </CodeLine>
        <CodeLine n={3}>
          {"  "}
          <span className="text-[#E78A9B]">return</span>{" "}
          <span className="text-[#9CC4F5]">{"<Layout"}</span>{" "}
          <span className="text-[#E6BB64]">data</span>=
          <span className="text-[#E78A9B]">{"{"}data{"}"}</span>{" "}
          <span className="text-[#9CC4F5]">{"/>"}</span>;
        </CodeLine>
        <CodeLine n={4} color="muted">
          {`}`}
        </CodeLine>
        <CodeLine n={5}> </CodeLine>
        <CodeLine n={6} color="comment">
          <span className="text-[var(--color-bg)]/35">
            {"// Lighthouse 100. SSR + ISR. SEO-ready."}
          </span>
        </CodeLine>
      </div>

      {/* Animated cursor */}
      <motion.span
        className="absolute w-[2px] h-4 bg-[var(--color-accent)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        style={{ bottom: 56, left: 86 }}
      />
    </div>
  );
}

function CodeLine({
  n,
  children,
  color = "default",
}: {
  n: number;
  children: React.ReactNode;
  color?: "default" | "muted" | "comment";
}) {
  return (
    <motion.div
      className="flex items-baseline gap-3 whitespace-pre"
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: 0.1 + n * 0.08 }}
    >
      <span className="text-[var(--color-bg)]/25 tabular-nums w-4 text-right select-none">
        {n}
      </span>
      <span className={color === "muted" ? "text-[var(--color-bg)]/55" : ""}>
        {children}
      </span>
    </motion.div>
  );
}
