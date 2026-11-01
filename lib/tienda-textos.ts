/**
 * Textos de la tienda en español e inglés: el de cada producto (landing) y el
 * de la interfaz (compra, gracias, descarga). El precio no está aquí: sale del
 * CRM, que es quien cobra.
 */
export type Idioma = "es" | "en";
export const idiomaDe = (v: unknown): Idioma => (v === "en" ? "en" : "es");

export interface Contenido {
  etiqueta: string;
  titulo: string;
  subtitulo: string;
  incluye: string[];
  necesitas: string[];
  capturas: { src: string; alt: string; movil?: boolean }[];
  faq: { p: string; r: string; contacto?: boolean }[];
}

const CAPTURAS = {
  ficha: "/tienda/vestuario-3d/ficha.webp",
  movilFicha: "/tienda/vestuario-3d/movil-ficha.webp",
  movilPersonaliza: "/tienda/vestuario-3d/movil-personaliza.webp",
  convocatoria: "/tienda/vestuario-3d/convocatoria.webp",
};

export const CONTENIDO: Record<string, Record<Idioma, Contenido>> = {
  "vestuario-3d": {
    es: {
      etiqueta: "Código + guía",
      titulo: "El vestuario 3D de tu club, listo para publicar",
      subtitulo:
        "El código completo de la web del vídeo y una guía para adaptarla a tu club con Claude Code: camisetas, plantilla, colores y escudo.",
      incluye: [
        "Vestuario 3D con una percha por jugador, su ficha y sus estadísticas (Astro y Three.js).",
        "Personalizador: nombre y dorsal en la camiseta, con enlace a la tienda del club (Shopify).",
        "Vídeo vertical de la convocatoria en MP4 (1080×1920), listo para redes.",
        "Pipeline para pasar de fotos de producto a camisetas 3D (Python y Blender).",
        "Un club de ejemplo completo: cambias una carpeta y es tu club.",
        "Guía en PDF para adaptarlo paso a paso con Claude Code.",
        "Listo para publicar con Docker o en cualquier hosting estático.",
      ],
      necesitas: [
        "Un ordenador con Node 22 y Claude Code.",
        "Para generar tus propias camisetas 3D, Python y Blender (gratis). Si tu camiseta tiene la forma de la del ejemplo, basta con cambiar las texturas.",
        "Escudo, camisetas y fotos de tu club, con permiso para usarlos.",
      ],
      capturas: [
        { src: CAPTURAS.ficha, alt: "El vestuario de ejemplo con la ficha de un jugador abierta" },
        { src: CAPTURAS.movilFicha, alt: "La camiseta y la ficha en el móvil", movil: true },
        { src: CAPTURAS.movilPersonaliza, alt: "El personalizador de nombre y dorsal en el móvil", movil: true },
        { src: CAPTURAS.convocatoria, alt: "El editor del vídeo de la convocatoria" },
      ],
      faq: [
        {
          p: "¿Necesito saber programar?",
          r: "No hace falta ser programador, pero sí perderle el miedo a la terminal: instalar Node, abrir el proyecto y pedirle cambios a Claude Code. La guía te lleva paso a paso.",
        },
        {
          p: "¿Puedo usar el escudo y las camisetas de cualquier club?",
          r: "Solo si eres el club o tienes su permiso: escudos, equipaciones y fotos son de sus dueños. Por eso la plantilla viene con un club inventado. Encaja perfecto con clubes de base, regionales y peñas que tienen su propio escudo.",
        },
        {
          p: "¿Lo puedo usar para webs de clientes?",
          r: "Sí, sin límite de proyectos. Lo que no puedes es revender o compartir la plantilla en sí.",
        },
        {
          p: "¿Recibo las actualizaciones?",
          r: "Sí. El enlace de descarga no caduca: cuando saque una versión nueva, estará en el mismo sitio.",
        },
        {
          p: "¿Y si prefiero que me lo hagas tú?",
          r: "Escríbeme desde la página de contacto y te digo qué haría falta y cuánto costaría para tu club.",
          contacto: true,
        },
      ],
    },
    en: {
      etiqueta: "Code + guide",
      titulo: "Your club's 3D locker room, ready to publish",
      subtitulo:
        "The full source code of the website from the video, plus a guide to adapt it to your club with Claude Code: shirts, squad, colours and crest.",
      incluye: [
        "3D locker room with a hanger per player, their profile card and stats (Astro and Three.js).",
        "Shirt customiser: name and number on the shirt, linked to the club's shop (Shopify).",
        "Vertical squad announcement video as MP4 (1080×1920), ready for social media.",
        "Pipeline to turn product photos into 3D shirts (Python and Blender).",
        "A complete sample club: swap one folder and it's your club.",
        "PDF guide to adapt it step by step with Claude Code.",
        "Ready to publish with Docker or on any static hosting.",
      ],
      necesitas: [
        "A computer with Node 22 and Claude Code.",
        "To generate your own 3D shirts, Python and Blender (free). If your shirt has the same cut as the sample one, swapping the textures is enough.",
        "Your club's crest, kits and photos, with permission to use them.",
      ],
      capturas: [
        { src: CAPTURAS.ficha, alt: "The sample locker room with a player's card open" },
        { src: CAPTURAS.movilFicha, alt: "The shirt and player card on mobile", movil: true },
        { src: CAPTURAS.movilPersonaliza, alt: "The name and number customiser on mobile", movil: true },
        { src: CAPTURAS.convocatoria, alt: "The squad announcement video editor" },
      ],
      faq: [
        {
          p: "Do I need to know how to code?",
          r: "You don't need to be a developer, but you do need to be comfortable with the terminal: installing Node, opening the project and asking Claude Code for changes. The guide walks you through it.",
        },
        {
          p: "Can I use any club's crest and kits?",
          r: "Only if you are the club or have its permission: crests, kits and photos belong to their owners. That's why the template ships with a made-up club. It's a perfect fit for grassroots and amateur clubs and supporters' groups with their own crest.",
        },
        {
          p: "Can I use it for client websites?",
          r: "Yes, for as many projects as you like. What you can't do is resell or share the template itself.",
        },
        {
          p: "Do I get updates?",
          r: "Yes. The download link never expires: when I release a new version, it'll be in the same place.",
        },
        {
          p: "What if I'd rather you built it for me?",
          r: "Get in touch through the contact page and I'll tell you what it would take and what it would cost for your club.",
          contacto: true,
        },
      ],
    },
  },
};

/** Textos de la interfaz de la tienda. */
export const T = {
  es: {
    pagoUnico: "Pago único",
    iva: "IVA incluido",
    lanzamiento: (hasta: string, normal: string) => `Precio de lanzamiento hasta el ${hasta}. Después, ${normal}.`,
    queIncluye: "Qué incluye",
    queNecesitas: "Qué necesitas",
    preguntas: "Preguntas",
    irContacto: "Ir a contacto",
    contacto: "/contacto",
    condiciones: "Condiciones de venta",
    legal: "/legal",
    avisoLegal: "Aviso legal",
    privacidad: "Privacidad",
    condicionesTexto: [
      ["Vende Bellostas Studio (los datos del titular están en el ", "aviso legal", "). El precio es un pago único con IVA incluido; se cobra con Stripe y no se guarda tu tarjeta."],
      ["Al pagar recibes al momento, en pantalla y por email, un enlace para descargar los archivos. El enlace no caduca e incluye las versiones nuevas que se publiquen."],
      ["Es contenido digital que se entrega en el acto: antes de pagar aceptas que pierdes el derecho de desistimiento de 14 días en cuanto lo descargas. Si algo no funciona como se describe aquí, escribe a info@bellostas.studio y lo arreglamos o te devolvemos el dinero."],
      ["Licencia: puedes usar y modificar el código en proyectos propios y de clientes, sin límite. No puedes revender, compartir ni publicar la plantilla en sí. Escudos, equipaciones y fotos de clubes reales son de sus titulares: úsalos solo con permiso."],
    ] as string[][],
    // compra
    acepto: ["Acepto las ", "condiciones de venta", " y que, al ser contenido digital que recibo al momento, pierdo el derecho de desistimiento en cuanto lo descargue."],
    marcaCasilla: "Marca la casilla para seguir.",
    comprar: (p: string) => `Comprar por ${p}`,
    abriendo: "Abriendo el pago…",
    errorPago: "No se pudo iniciar el pago.",
    pagoSeguro: "Pago seguro con Stripe · descarga inmediata y por email",
    pronto: "Muy pronto a la venta.",
    // gracias
    confirmando: "Estamos confirmando tu pago",
    confirmando1: "Si has pagado, en unos minutos te llega un email con el enlace de descarga. Mira también en spam o promociones.",
    confirmando2: "¿Pasa un rato y no llega? Escribe a info@bellostas.studio con el email con el que pagaste.",
    // descarga
    compraConfirmada: "Compra confirmada",
    aquiTienes: (p: string) => `Gracias. Aquí tienes ${p}`,
    teHemos: ["Te hemos mandado este mismo enlace a ", ". Guárdalo: no caduca y las versiones nuevas aparecerán aquí."],
    laGuia: "La guía: empieza por aquí",
    elCodigo: "El código",
    preparando: "Estamos preparando los archivos. Vuelve a este enlace en un rato.",
    prefieres: "¿Prefieres que te lo monte yo para tu club?",
    escribeme: "Escríbeme",
    problema: "¿Algún problema? Escribe a info@bellostas.studio",
  },
  en: {
    pagoUnico: "One-off payment",
    iva: "VAT included",
    lanzamiento: (hasta: string, normal: string) => `Launch price until ${hasta}. After that, ${normal}.`,
    queIncluye: "What's included",
    queNecesitas: "What you need",
    preguntas: "Questions",
    irContacto: "Go to contact",
    contacto: "/en/contact",
    condiciones: "Terms of sale",
    legal: "/en/legal",
    avisoLegal: "Legal notice",
    privacidad: "Privacy",
    condicionesTexto: [
      ["Sold by Bellostas Studio (the owner's details are in the ", "legal notice", "). The price is a one-off payment with VAT included; it's charged through Stripe and your card is not stored."],
      ["Once you pay, you instantly get a link to download the files, on screen and by email. The link never expires and includes any new versions released."],
      ["This is digital content delivered immediately: before paying you agree that you lose the 14-day right of withdrawal as soon as you download it. If something doesn't work as described here, write to info@bellostas.studio and we'll fix it or refund you."],
      ["Licence: you can use and modify the code in your own and your clients' projects, without limit. You can't resell, share or publish the template itself. Crests, kits and photos of real clubs belong to their owners: use them only with permission."],
    ] as string[][],
    acepto: ["I accept the ", "terms of sale", " and understand that, since this is digital content delivered immediately, I lose the right of withdrawal once I download it."],
    marcaCasilla: "Tick the box to continue.",
    comprar: (p: string) => `Buy for ${p}`,
    abriendo: "Opening checkout…",
    errorPago: "Couldn't start the payment.",
    pagoSeguro: "Secure payment with Stripe · instant download and by email",
    pronto: "Coming soon.",
    confirmando: "We're confirming your payment",
    confirmando1: "If you've paid, you'll get an email with the download link within a few minutes. Check your spam or promotions folder too.",
    confirmando2: "Still nothing after a while? Write to info@bellostas.studio from the email you paid with.",
    compraConfirmada: "Purchase confirmed",
    aquiTienes: (p: string) => `Thank you. Here's ${p}`,
    teHemos: ["We've also sent this link to ", ". Keep it: it never expires and new versions will show up here."],
    laGuia: "The guide: start here",
    elCodigo: "The code",
    preparando: "We're getting the files ready. Come back to this link in a little while.",
    prefieres: "Would you rather I built it for your club?",
    escribeme: "Get in touch",
    problema: "Any problem? Write to info@bellostas.studio",
  },
};

export const euros = (centimos: number, idioma: Idioma = "es") =>
  new Intl.NumberFormat(idioma === "en" ? "en-IE" : "es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: centimos % 100 ? 2 : 0,
  }).format(centimos / 100);
