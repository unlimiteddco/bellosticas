import { CookiesV2 } from "./CookiesV2";
import { RevealRoot } from "./RevealRoot";
import { TemaRoot } from "./TemaRoot";

/*
 * La raíz de la V2 (su hoja, app/v2.css, se carga en app/(frontend)/layout.tsx).
 * El script en línea corre antes de pintar: pone el tema guardado (claro si no se ha elegido nunca: es la cara de la marca) y marca que hay JS,
 * que es lo que permite esconder lo que luego entra al hacer scroll. Sin JS
 * no se esconde nada.
 */
const SCRIPT_TEMA = `(function(){try{var r=document.getElementById('v2-root');var t=localStorage.getItem('bs-theme');if(t!=='dark'&&t!=='light'){t='light'}r.setAttribute('data-theme',t);r.classList.add('v2-js');}catch(e){}})();`;

export function V2Root({ children }: { children: React.ReactNode }) {
  return (
    <div id="v2-root" className="v2" data-theme="light" suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{ __html: SCRIPT_TEMA }} />
      <TemaRoot />
      <RevealRoot />
      {children}
      <CookiesV2 />
    </div>
  );
}
