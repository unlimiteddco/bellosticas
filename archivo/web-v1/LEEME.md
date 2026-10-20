# Web V1 (archivada)

Las páginas de la web anterior a la V2, tal como estaban publicadas, guardadas
aquí al sustituirlas por la V2 (octubre de 2026). No se compilan (`archivo`
está excluido en `tsconfig.json` y fuera de `app/`).

- Para verlas como estaban: la etiqueta de git `web-v1` apunta al último
  commit publicado con la V1 (a186292, en la rama feat/propuestas-web, que
  es la que despliega Dokploy).
- Para recuperar una página: copiarla de vuelta a `app/(frontend)/[locale]/…`
  y volver a añadir su ruta en `navigation.ts`.

Los componentes que usaban (components/sections, components/layout…) siguen en
su sitio: varios los reutiliza la V2.
