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
export type Phase = {
  name: string;
  tags?: string[];
  /** "3 semanas" — la duración es lo que convierte una lista en un plan. */
  duration?: string | null;
  items: string[];
};

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
  /** Punto de partida — de las notas, nunca inventado. */
  context?: ProposalContext | null;
  /** Hoy vs con la nueva web. */
  contrast?: ProposalContrast | null;
  /** Lo que aporta el cliente y lo que se presupuesta aparte. */
  scope?: ProposalScope | null;
  /** Preguntas propias de esta propuesta; si faltan, salen las de siempre. */
  faqs?: ProposalFaq[] | null;
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
  /** Explicación larga para el "ver más". */
  details?: string | null;
  price: string | number;
  recommended: boolean;
};

/** Punto de partida: dónde está hoy y qué tiene que demostrar la web. */
export type ProposalContext = {
  intro: string;
  proofs?: string[] | null;
};

/** El antes y el después, enfrentados. */
export type ProposalContrast = {
  today: string[];
  after: string[];
};

/** Qué aporta el cliente y qué queda fuera del precio. */
export type ProposalScope = {
  provides: string[];
  excluded: string[];
  note?: string | null;
};

export type ProposalFaq = { q: string; a: string };

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

const DEMO_PROPOSAL: ProposalPayload = {
  ok: true,
  expired: false,
  prefill: {
    contactName: "Gráficas Imagen",
    contactEmail: "info@graficasimagen.es",
    phone: "876 286 986",
  },
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
      "1 h/mes de cambios incluida",
      "Entorno de pruebas",
      "Informe mensual",
    ],
    nota: "La web recibe archivos y datos de empleados de vuestros clientes, y los formularios son un canal comercial activo: necesita vigilancia de entregabilidad, copias y actualizaciones continuas. El primer mes va incluido en el proyecto.",
  },
  extras: [
    {
      id: "11111111-1111-1111-1111-111111111111",
      label: "Portal de cliente",
      description: "Acceso privado por empresa, con sus precios y repedido en dos clics.",
      details:
        "Cada empresa entra con su acceso y ve su catálogo con los precios que tenéis pactados con ella, los artes que ya aprobó y su histórico de pedidos. Repetir un pedido pasa de diez mensajes a dos clics.\n\nEs la ampliación natural de esta web: tiene sentido cuando el volumen de cuentas grandes lo justifique, no antes.",
      price: "1400",
      recommended: false,
    },
    {
      id: "22222222-2222-2222-2222-222222222222",
      label: "Aprobación de artes online",
      description: "El cliente aprueba el diseño final con fecha registrada.",
      details:
        "Le mandáis un enlace, ve el arte final y lo aprueba o pide cambios ahí mismo. Queda registrado quién aprobó y cuándo.\n\nSirve para lo de siempre: cuando alguien dice que el logo iba en otra posición, hay una aprobación con fecha en vez de una conversación de WhatsApp.",
      price: "600",
      recommended: false,
    },
    {
      id: "33333333-3333-3333-3333-333333333333",
      label: "Landings por sector",
      description: "Una página por sector para posicionar y para campañas.",
      details:
        "Una página propia para hostelería, otra para industria, otra para sanidad. Cada una habla el idioma de ese sector y compite por sus búsquedas en Google.\n\nAdemás son el destino natural si algún día hacéis campañas: mandar tráfico a la home convierte mucho peor que mandarlo a la página de su sector.",
      price: "450",
      recommended: true,
    },
  ],
  proposal: {
    title:
      "El sitio que convierte a Gráficas Imagen en el proveedor de uniformidad de las empresas de Aragón",
    clientName: "Gráficas Imagen",
    serviceType: "web_corporativa",
    transformation:
      "Que pedir uniformidad a Gráficas Imagen sea tan fácil que una empresa de 40 empleados no se plantee llamar a otro.",
    timeline: "5 semanas desde que entregáis marca, textos y fotos",
    total: "1500",
    status: "sent",
    expiresAt: "2026-09-21T23:59:59.000Z",
    context: {
      intro:
        "graficasimagen.es está hoy vacío: una instalación de WordPress sin contenido. La marca nueva ya está lista y anunciándose en redes, así que este es el momento de construir la web de la etapa nueva, no de parchear la anterior.",
      proofs: [
        "Que Gráficas Imagen es un proveedor de uniformidad, no una imprenta que además hace ropa",
        "Que pedir para 40 empleados es un proceso ordenado, no diez mensajes y un Excel de tallas",
        "Que la marca nueva es la de una empresa con la que se firma un contrato anual",
      ],
    },
    contrast: {
      today: [
        "El dominio, vacío mientras la marca nueva ya se anuncia",
        "Los pedidos se piden por WhatsApp, con logos en JPG",
        "Las tallas se recogen en un Excel que va y viene",
        "Nada transmite el nivel que busca una empresa de 40 empleados",
      ],
      after: [
        "Una web que presenta la ropa laboral como el servicio principal",
        "Un configurador que recoge la petición completa y ordenada",
        "Cada empleado pone su talla desde un enlace, sin registrarse",
        "La tabla de tallas descargable en Excel, lista para producir",
      ],
    },
    scope: {
      provides: [
        "Manual de marca nuevo y logotipo en vectorial",
        "Textos de los servicios y fotos de trabajos realizados",
        "Listado de prendas, sectores y técnicas de marcaje",
        "Correo donde deben llegar las peticiones",
        "Accesos al dominio y al hosting actual",
      ],
      excluded: [
        "Tienda online y pago con tarjeta",
        "Cálculo automático de precios en el configurador",
        "Gestión de stock o enlace con vuestro programa de facturación",
        "Redacción de textos comerciales y traducciones",
        "Fotografía y vídeo de producto",
        "Campañas de Google Ads y gestión de redes",
      ],
      note: "El plazo empieza a contar desde que está entregado todo lo de la izquierda, no desde la firma. Nada de la derecha condiciona el proyecto: se presupuesta aparte solo si algún día hace falta.",
    },
    faqs: [
      {
        q: "¿El configurador enseña nuestros precios a la competencia?",
        a: "No. No muestra ninguna tarifa: recoge la petición completa y os la entrega ordenada para que presupuestéis vosotros como hacéis ahora, pero sin diez mensajes de ida y vuelta.",
      },
      {
        q: "Nuestra web actual está vacía, ¿perdemos algo al empezar de cero?",
        a: "No hay contenido que perder. El dominio y las cuentas de correo siguen funcionando igual durante todo el proceso.",
      },
      {
        q: "¿Y si dentro de unos meses queremos que nuestros clientes repitan pedido solos?",
        a: "Está previsto. El portal de cliente es la ampliación natural de esta web y se presupuesta aparte cuando el volumen lo justifique.",
      },
    ],
    highlights: [
      {
        title: "Ropa laboral primero",
        description: "La página principal del servicio con el que queréis crecer, por sectores.",
      },
      {
        title: "Peticiones ordenadas",
        description: "Prenda, cantidad, marcaje y logo llegan estructurados a vuestro correo.",
      },
      {
        title: "Tallas sin perseguir",
        description: "Cada empleado pone la suya desde un enlace; vosotros la descargáis en Excel.",
      },
      {
        title: "Logos que sirven",
        description: "Avisa solo si el archivo no es vectorial o no tiene resolución.",
      },
    ],
    phases: [
      {
        name: "Web corporativa nueva",
        duration: "3 semanas",
        items: [
          "Seis páginas con vuestra identidad nueva: inicio, ropa laboral, imprenta y papelería, rotulación, merchandising y contacto",
          "La página de ropa laboral montada como servicio principal, con sus sectores: hostelería, industria, sanidad, limpieza y alimentación",
          "Fichas de trabajos realizados con las fotos que aportéis",
          "Que os encuentren en Google: velocidad, estructura y metadatos por página",
          "Formulario de contacto y enlace directo a WhatsApp",
          "Desarrollo propio, sin WordPress ni plugins de pago que la frenan y se rompen entre sí",
        ],
      },
      {
        name: "Configurador de petición de ropa laboral",
        duration: "incluido en las 2 semanas",
        items: [
          "Cuatro pasos guiados: prenda, cantidad y sectores, técnica de marcaje y posiciones del logo",
          "Vinilo, serigrafía, bordado o transfer, con la subida del archivo",
          "Aviso automático si el logo no es vectorial o se queda corto de resolución",
          "El resumen os llega por email ordenado y listo para presupuestar",
          "Sin mostrar tarifas: los precios los ponéis vosotros, como ahora",
        ],
      },
      {
        name: "Recogida de tallas por empleado",
        duration: "incluido en las 2 semanas",
        items: [
          "Un enlace por pedido que el responsable reparte a su plantilla",
          "Cada empleado pone nombre, puesto, prenda y talla, sin registrarse",
          "Vosotros veis la tabla completa y la descargáis en Excel o CSV",
        ],
      },
    ],
  },
  items: [
    { description: "Web corporativa nueva", quantity: 1, unitPrice: "900" },
    { description: "Configurador de petición de ropa laboral", quantity: 1, unitPrice: "400" },
    { description: "Recogida de tallas por empleado", quantity: 1, unitPrice: "200" },
  ],
  installments: [
    { label: "Al aceptar la propuesta", amount: "750", dueRule: "on_accept", dueDate: null },
    { label: "A la entrega", amount: "750", dueRule: "on_delivery", dueDate: null },
  ],
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
