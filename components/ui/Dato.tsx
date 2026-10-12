/**
 * Etiqueta de dato: mono, mayúsculas, espaciada. Para lo que es información
 * y no texto —números de orden, stack, años, estados—. Los titulares y el
 * cuerpo siguen en Helvena y Crimson.
 */
export function Dato({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`font-mono uppercase text-[10.5px] leading-none ${className}`} style={{ letterSpacing: "0.14em" }}>
      {children}
    </span>
  );
}
