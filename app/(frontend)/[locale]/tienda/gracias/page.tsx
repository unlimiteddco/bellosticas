import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MarcoTienda } from "@/components/sections/tienda/MarcoTienda";
import { alCrm } from "@/lib/tienda";

/*
 * Vuelta de Stripe tras pagar (?session_id=cs_…). El CRM comprueba en Stripe
 * que el pago está hecho, guarda la venta si el webhook aún no ha llegado y
 * devuelve el código de descarga: de aquí se salta a /compra/<código>.
 */
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Gracias · Bellostas Studio", robots: { index: false, follow: false } };

export default async function GraciasPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
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
  if (token) redirect(`/compra/${token}`);

  return (
    <MarcoTienda>
      <div className="v2-card flex flex-col gap-3 p-6 text-center">
        <h1 className="text-[26px] font-medium leading-[1.15] tracking-[-0.02em]">Estamos confirmando tu pago</h1>
        <p className="text-[15px] leading-[1.6] text-[var(--v2-muted)]">
          Si has pagado, en unos minutos te llega un email con el enlace de descarga. Mira también en spam o promociones.
        </p>
        <p className="text-[15px] leading-[1.6] text-[var(--v2-muted)]">
          ¿Pasa un rato y no llega? Escribe a info@bellostas.studio con el email con el que pagaste.
        </p>
      </div>
    </MarcoTienda>
  );
}
