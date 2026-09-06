/**
 * Cliente server-side de propuestas: lee la propuesta del CRM por token con el
 * shared secret (server-to-server, el secret NUNCA llega al cliente).
 *
 * Contrato del CRM:
 *   GET {CRM_BASE_URL}/api/public/proposals/[token]
 *   header: x-webhook-secret: {WEB_WEBHOOK_SECRET}
 *   → { ok, proposal, items, installments, expired }
 */

const CRM_BASE_URL = process.env.CRM_BASE_URL ?? "https://admin.bellostas.studio";
const SECRET = process.env.WEB_WEBHOOK_SECRET;

export type ProposalItem = {
  id?: string;
  description: string;
  quantity: string | number;
  unitPrice: string | number;
};

export type Installment = {
  id?: string;
  label: string;
  amount: string | number;
  dueRule: string;
  dueDate: string | null;
};

export type Highlight = { title: string; description: string };
export type Phase = { name: string; tags?: string[]; items: string[] };

export type ProposalData = {
  title: string;
  /** Nombre del cliente (empresa o persona, según venga del CRM) para el saludo del hero. */
  clientName?: string | null;
  serviceType: string | null;
  transformation: string | null;
  timeline: string | null;
  total: string | number;
  status: string;
  /** Fecha de expiración (ISO) — se muestra como "válida hasta" si existe. */
  expiresAt?: string | null;
  /** Piezas de la solución (rejilla cualitativa, estilo documento). */
  highlights?: Highlight[] | null;
  /** Alcance fase a fase. */
  phases?: Phase[] | null;
};

/** Plan de mantenimiento asignado a esta propuesta (uno solo, nunca un menú). */
export type MaintenancePlan = {
  id: string;
  nombre: string;
  mensual: number;
  anual: number;
  /** Ahorro anual EN EUROS — nunca en porcentaje. */
  ahorro: number;
  incluye: string[];
  nota?: string | null;
};

/** Datos que el CRM ya tiene del cliente: rellenan el formulario, no lo ocultan. */
export type ProposalPrefill = {
  contactName?: string;
  contactEmail?: string;
  phone?: string;
};

/** Añadido opcional que el cliente puede marcar. */
export type ProposalExtra = {
  id: string;
  label: string;
  description: string | null;
  price: string | number;
  recommended: boolean;
};

export type ProposalPayload = {
  ok: boolean;
  proposal: ProposalData;
  items: ProposalItem[];
  installments: Installment[];
  expired: boolean;
  maintenance?: MaintenancePlan | null;
  prefill?: ProposalPrefill | null;
  extras?: ProposalExtra[] | null;
  selectedExtras?: { id: string; label: string; price: string }[] | null;
};

export async function fetchProposal(token: string): Promise<ProposalPayload | null> {
  // Fixture de desarrollo: previsualiza el diseño sin el CRM levantado.
  if (process.env.NODE_ENV !== "production" && token === "demo") {
    return DEMO_PROPOSAL;
  }

  // Una propuesta que no se puede leer NO es una propuesta que no existe.
  // Devolver `null` ante un CRM caído acaba en un 404: el cliente lee
  // "esta propuesta no existe" y da por hecho que se la hemos retirado.
  // Solo el 404 real del CRM devuelve null; lo demás lanza y lo recoge
  // el error boundary, que sí invita a reintentar.
  if (!SECRET) {
    console.error("[propuestas] WEB_WEBHOOK_SECRET no configurado");
    throw new Error("proposal_fetch_misconfigured");
  }

  const url = `${CRM_BASE_URL.replace(/\/+$/, "")}/api/public/proposals/${encodeURIComponent(token)}`;
  let res: Response;
  try {
    res = await fetch(url, {
      headers: { "x-webhook-secret": SECRET },
      // El estado de la propuesta cambia (vista/aceptada) → siempre fresco.
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
  } catch (e) {
    console.error("[propuestas] el CRM no responde", e);
    throw new Error("proposal_fetch_unreachable");
  }

  // Token inexistente o revocado: eso sí es un 404 honesto.
  if (res.status === 404) return null;

  if (!res.ok) {
    console.error(`[propuestas] el CRM respondió ${res.status} para el token ${token}`);
    throw new Error(`proposal_fetch_failed_${res.status}`);
  }

  const data = (await res.json().catch(() => null)) as ProposalPayload | null;
  if (!data) throw new Error("proposal_fetch_bad_json");
  if (!data.ok) return null;
  return data;
}

export function formatEUR(amount: string | number, locale: string): string {
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat(locale === "en" ? "en-IE" : "es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(Number.isFinite(n) ? n : 0);
}

/**
 * Igual que `formatEUR`, pero sin céntimos cuando el importe es redondo.
 * Los precios de mantenimiento son titulares ("89 €/mes"), no líneas de
 * factura: los ",00" ensucian la lectura.
 */
export function formatEURPrecio(amount: number, locale: string): string {
  const entero = Number.isInteger(amount);
  return new Intl.NumberFormat(locale === "en" ? "en-IE" : "es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: entero ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function lineTotal(item: ProposalItem): number {
  const q = typeof item.quantity === "string" ? parseFloat(item.quantity) : item.quantity;
  const p = typeof item.unitPrice === "string" ? parseFloat(item.unitPrice) : item.unitPrice;
  return (Number.isFinite(q) ? q : 0) * (Number.isFinite(p) ? p : 0);
}

const DEMO_PROPOSAL: ProposalPayload = {
  ok: true,
  expired: false,
  prefill: { contactName: "Hugo Gotten", contactEmail: "hugo@gottengym.es", phone: "600 123 456" },
  extras: [
    {
      id: "11111111-1111-1111-1111-111111111111",
      label: "Diseño de packaging",
      description: "Etiquetas y cajas listas para imprenta, con tu identidad.",
      price: "450",
      recommended: true,
    },
    {
      id: "22222222-2222-2222-2222-222222222222",
      label: "Catálogo descargable",
      description: "Tu catálogo en PDF, actualizable por ti desde el panel.",
      price: "300",
      recommended: false,
    },
    {
      id: "33333333-3333-3333-3333-333333333333",
      label: "Formulario de presupuesto",
      description: "Pide medidas y tirada, y te llega ya calculado.",
      price: "250",
      recommended: false,
    },
  ],
  maintenance: {
    id: "profesional",
    nombre: "Profesional",
    mensual: 89,
    anual: 960,
    ahorro: 108,
    incluye: [
      "Servidor, dominio y SSL",
      "Actualizaciones de seguridad",
      "Copias de seguridad diarias",
      "Monitorización de caída",
      "Soporte por email (24 h laborables)",
      "1 h/mes de cambios",
      "Entorno de pruebas",
      "Informe mensual",
    ],
    nota: null,
  },
  proposal: {
    title: "Tienda online a medida para Gotten Gym",
    clientName: "Hugo",
    serviceType: "tienda_online",
    transformation:
      "Convertir las visitas en socios: una tienda rápida, con pasarela de pago y panel propio para gestionar planes sin depender de nadie.",
    timeline: "Entrega en 3–4 semanas desde el anticipo",
    total: "4200.00",
    status: "sent",
    expiresAt: "2026-06-24T00:00:00.000Z",
    highlights: [
      { title: "Tienda profesional", description: "Catálogo, carrito y pasarela de pago lista para vender desde el primer día." },
      { title: "Panel propio", description: "Gestiona productos, pedidos y planes sin depender de nadie ni de plantillas." },
      { title: "Rápida y optimizada", description: "Construida en Next.js: máxima velocidad, SEO y experiencia impecable en móvil." },
      { title: "Pagos y socios", description: "Cobro automático de cuotas y alta de socios integrados en la propia web." },
    ],
    phases: [
      { name: "Fase 1 · Diseño y tienda", tags: ["DISEÑO", "DESARROLLO"], items: ["Identidad visual y sistema de diseño", "Maquetación de las páginas clave", "Catálogo de productos y fichas", "Carrito y checkout con pasarela de pago"] },
      { name: "Fase 2 · Panel y socios", tags: ["BACKOFFICE", "ACCESOS"], items: ["Panel de administración a medida", "Gestión de planes y cuotas", "Alta y área privada de socios", "Notificaciones por email"] },
      { name: "Fase 3 · Lanzamiento", tags: ["PRUEBAS", "FORMACIÓN"], items: ["Pruebas y control de calidad", "Puesta en producción", "Formación de uso del panel", "30 días de soporte incluido"] },
    ],
  },
  items: [
    { id: "1", description: "Diseño a medida (UX/UI) y sistema visual", quantity: "1", unitPrice: "1400.00" },
    { id: "2", description: "Desarrollo del e-commerce (Next.js + pasarela de pago)", quantity: "1", unitPrice: "1900.00" },
    { id: "3", description: "Panel de administración de planes y socios", quantity: "1", unitPrice: "600.00" },
    { id: "4", description: "Puesta en producción + formación", quantity: "1", unitPrice: "300.00" },
  ],
  installments: [
    { id: "a", label: "Anticipo (50%)", amount: "2100.00", dueRule: "on_accept", dueDate: null },
    { id: "b", label: "Entrega (50%)", amount: "2100.00", dueRule: "on_delivery", dueDate: null },
  ],
};
