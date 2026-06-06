"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type Order = {
  id: number;
  number: string;
  customer: string;
  flag: string;
  price: string;
};

const CUSTOMER_POOL: Omit<Order, "id" | "number">[] = [
  { customer: "María L.",   flag: "🇪🇸", price: "24,90 €" },
  { customer: "Lukas K.",   flag: "🇩🇪", price: "89,00 €" },
  { customer: "Anne D.",    flag: "🇫🇷", price: "47,50 €" },
  { customer: "João P.",    flag: "🇵🇹", price: "18,50 €" },
  { customer: "Sofia R.",   flag: "🇮🇹", price: "32,00 €" },
  { customer: "Bram V.",    flag: "🇳🇱", price: "59,90 €" },
  { customer: "Léa M.",     flag: "🇧🇪", price: "16,90 €" },
  { customer: "Sarah W.",   flag: "🇬🇧", price: "210,00 €" },
  { customer: "Felix B.",   flag: "🇨🇭", price: "39,00 €" },
  { customer: "Carlos M.",  flag: "🇪🇸", price: "72,40 €" },
];

const COUNTER_BASE = 847;
const START_ORDER = 1284;
const VISIBLE = 4;
const ROW_HEIGHT = 44;

function buildInitial(): Order[] {
  return Array.from({ length: VISIBLE }, (_, i) => ({
    id: i,
    number: `#${START_ORDER - i}`,
    ...CUSTOMER_POOL[i % CUSTOMER_POOL.length],
  }));
}

export function OrdersWindow() {
  const [orders, setOrders] = useState<Order[]>(() => buildInitial());
  const [counter, setCounter] = useState(COUNTER_BASE);
  const [nextId, setNextId] = useState(1000);
  const [nextOrderNum, setNextOrderNum] = useState(START_ORDER + 1);

  useEffect(() => {
    const tick = setInterval(() => {
      const newId = nextId;
      const newOrderNum = nextOrderNum;
      const pick =
        CUSTOMER_POOL[Math.floor(Math.random() * CUSTOMER_POOL.length)];

      const next: Order = {
        id: newId,
        number: `#${newOrderNum}`,
        ...pick,
      };

      setOrders((prev) => [next, ...prev.slice(0, VISIBLE - 1)]);
      setCounter((c) => c + 1);
      setNextId((id) => id + 1);
      setNextOrderNum((n) => n + 1);
    }, 3200);
    return () => clearInterval(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextId, nextOrderNum]);

  return (
    <div
      className="relative rounded-2xl overflow-hidden bg-[var(--color-text)] shadow-[0_30px_60px_-20px_rgba(29,29,27,0.45)]"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--color-bg)]/10">
        <div className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5" aria-hidden>
            <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
          </span>
          <span
            className="font-body uppercase text-[10px] text-[var(--color-bg)]/70"
            style={{ letterSpacing: "0.16em" }}
          >
            LIVE · Orders
          </span>
        </div>
        <span
          className="font-body text-[10px] text-[var(--color-bg)]/40"
          style={{ letterSpacing: "0.04em" }}
        >
          tienda.es / admin
        </span>
      </div>

      {/* Counter row */}
      <div className="flex items-baseline justify-between px-4 py-3 border-b border-[var(--color-bg)]/10">
        <div className="flex items-baseline gap-2">
          <motion.span
            key={counter}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="font-display italic text-[var(--color-accent)] text-[28px] md:text-[32px] leading-none tabular-nums"
          >
            {counter}
          </motion.span>
          <span
            className="font-body uppercase text-[10px] text-[var(--color-bg)]/55"
            style={{ letterSpacing: "0.18em" }}
          >
            pedidos hoy
          </span>
        </div>
        <span
          className="font-body text-[10px] text-[var(--color-bg)]/35"
          style={{ letterSpacing: "0.04em" }}
        >
          últimas 24h
        </span>
      </div>

      {/* Column headers */}
      <div
        className="grid grid-cols-[60px_1fr_auto_auto] gap-3 px-4 py-2 border-b border-[var(--color-bg)]/10 text-[9px] uppercase text-[var(--color-bg)]/40"
        style={{ letterSpacing: "0.14em" }}
      >
        <span>Order</span>
        <span>Customer</span>
        <span className="text-right">Total</span>
        <span>Status</span>
      </div>

      {/* Orders feed — fixed height container, no layout shift */}
      <div
        className="relative overflow-hidden"
        style={{ height: `${VISIBLE * ROW_HEIGHT}px` }}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {orders.map((o, i) => (
            <motion.div
              key={o.id}
              layout
              initial={{ opacity: 0, y: -ROW_HEIGHT }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.25 } }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 30,
              }}
              className="grid grid-cols-[60px_1fr_auto_auto] gap-3 items-center px-4 border-b border-[var(--color-bg)]/5"
              style={{
                height: ROW_HEIGHT,
                background:
                  i === 0 ? "rgba(194,38,58,0.08)" : "transparent",
              }}
            >
              <span className="font-body text-[11px] text-[var(--color-bg)]/45 tabular-nums">
                {o.number}
              </span>
              <span className="font-body text-[12px] text-[var(--color-bg)] flex items-center gap-1.5 truncate">
                <span className="text-[14px] leading-none">{o.flag}</span>
                <span className="truncate">{o.customer}</span>
              </span>
              <span className="font-body text-[12px] font-semibold text-[var(--color-bg)] tabular-nums whitespace-nowrap">
                {o.price}
              </span>
              <span
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-medium"
                style={{
                  background: "rgba(123, 197, 123, 0.14)",
                  color: "#7BC57B",
                  letterSpacing: "0.04em",
                }}
              >
                <span
                  className="inline-block w-1 h-1 rounded-full"
                  style={{ background: "#7BC57B" }}
                />
                Paid
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
