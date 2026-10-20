import {
  ArrowRightLeft,
  Handshake,
  LayoutDashboard,
  Layers,
  type LucideIcon,
  Monitor,
  PenTool,
  Search,
  ShieldCheck,
  ShoppingBag,
  Workflow,
} from "lucide-react";

/**
 * Los iconos del catálogo de servicios, por nombre: el servidor (el índice) y
 * el cliente (el acordeón) los comparten, y a un componente de cliente no se le
 * pueden pasar componentes desde el servidor. Los mismos que el megamenú.
 */
export const ICONOS_CATALOGO = {
  marca: PenTool,
  web: Monitor,
  tienda: ShoppingBag,
  app: LayoutDashboard,
  flujo: Workflow,
  migracion: ArrowRightLeft,
  partner: Handshake,
  escudo: ShieldCheck,
  capas: Layers,
  busqueda: Search,
} satisfies Record<string, LucideIcon>;
