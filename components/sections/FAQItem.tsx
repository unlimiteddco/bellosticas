"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

type Props = {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
};

export function FAQItem({ question, answer, open, onToggle }: Props) {
  return (
    <div className="border-b border-[var(--color-border)]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-6 py-6 text-left group"
      >
        <span className="font-body font-medium text-[18px] text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
          {question}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="shrink-0 w-9 h-9 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text)] group-hover:border-[var(--color-accent)] group-hover:text-[var(--color-accent)] transition-colors"
        >
          <Plus size={16} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 pr-12 font-body text-[16px] leading-[1.6] text-[var(--color-text-muted)] max-w-[680px]">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
