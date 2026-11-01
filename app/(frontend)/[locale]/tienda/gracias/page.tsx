import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MarcoTienda } from "@/components/sections/tienda/MarcoTienda";
import { alCrm } from "@/lib/tienda";
import { T, idiomaDe } from "@/lib/tienda-textos";

/*
 * Vuelta de Stripe tras pagar (?session_id=cs_…). El CRM comprueba en Stripe
 * que el pago está hecho, guarda la venta si el webhook aún no ha llegado y
 * devuelve el código de descarga: de aquí se salta a /compra/<código>.
 */
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Bellostas Studio", robots: { index: false, follow: false } };

export default async function GraciasPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const idioma = idiomaDe((await params).locale);
  const t = T[idioma];
  const { session_id } = await searchParams;
  let token: string | null = null;
  if (session_id && /^cs_[A-Za-z0-9_]{10,200}$/.test(session_id)) {
    try {
      const res = await alCrm("/api/public/tienda/compras", { sessionId: session_id });
      const j = (await res.json().catch(() => ({}))) as { token?: string };
      if (res.ok && j.token) token = j.token;
    } catch {
      // se queda en el mensaje de abajo
    }
  }
  if (token) redirect(`${idioma === "en" ? "/en" : ""}/compra/${token}`);

  return (
    <MarcoTienda pie={t.problema}>
      <div className="v2-card flex flex-col gap-3 p-6 text-center">
        <h1 className="text-[26px] font-medium leading-[1.15] tracking-[-0.02em]">{t.confirmando}</h1>
        <p className="text-[15px] leading-[1.6] text-[var(--v2-muted)]">{t.confirmando1}</p>
        <p className="text-[15px] leading-[1.6] text-[var(--v2-muted)]">{t.confirmando2}</p>
      </div>
    </MarcoTienda>
  );
}
