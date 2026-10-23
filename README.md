# Firme por la Patria — Portal web

Portal de la demo web del juego **Firme por la Patria**: presentación, instrucciones, carga del nivel de demostración (build WebGL de Unity) y pantalla final con la invitación a la versión completa en App Store, Google Play y Roblox.

La lógica de la partida vive en el proyecto Unity (`mao2319/patriamilagrogame`). Este portal solo presenta el juego y reacciona a sus eventos (nivel completado o fallido).

## Requisitos

- Node.js 24 o superior.
- npm 11 o superior.

## Ejecutar en local

```bash
npm install
cp .env.example .env.local   # opcional: enlaces de tiendas y URL del build
npm run dev                  # http://localhost:3000
```

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo. |
| `npm run build` | Build de producción. |
| `npm run lint` | ESLint. |
| `npm test` | Pruebas unitarias (Vitest). |
| `npm run publish:unity` | Sube la build de Unity de `public/unity/Build` a Vercel Blob (producción y vistas previas la usan). |

## Variables de entorno

Ver `.env.example`. Todas son públicas (`NEXT_PUBLIC_`): **nunca** poner secretos aquí.

- `NEXT_PUBLIC_APP_STORE_URL`, `NEXT_PUBLIC_GOOGLE_PLAY_URL`, `NEXT_PUBLIC_ROBLOX_URL`: enlaces a la versión completa. Si faltan o no son del dominio de la tienda, el botón dice «Próximamente».
- `NEXT_PUBLIC_UNITY_BUILD_URL`: carpeta del build WebGL. Por defecto `/unity` (este mismo sitio), que es donde `next.config.ts` envía los encabezados Brotli que necesita Unity.
- `UNITY_BUILD_ORIGIN` (solo en Vercel, no pública): dirección del almacén de Vercel Blob con la build. Si `public/unity` no está (deploys desde GitHub), `/unity/...` se sirve desde ahí con los mismos encabezados.

## El juego (build WebGL de Unity)

El build no se versiona aquí: se genera desde el proyecto Unity y se copia a `public/unity/Build` (ver `Docs/BUILD_WEBGL.md` en el repo del juego). Luego `npm run dev` y abrir `/jugar`.

**Publicar una build nueva:** `npm run publish:unity` (sube los archivos a Vercel Blob). Los deploys automáticos desde GitHub la toman de ahí; no hace falta volver a desplegar el portal. Blob la guarda en caché 5 minutos.

- `src/components/game/UnityGame.tsx`: carga el juego con el progreso real de Unity, avisa si tarda, permite reintentar y detecta si el navegador no soporta WebGL 2.
- `src/lib/unityBridge.ts`: valida los eventos del juego (`ready`, `levelCompleted`, `levelFailed`).
- `src/components/game/GameExperience.tsx`: al completar el nivel muestra el resultado y las tiendas (la del dispositivo primero).

## Estructura

```
src/app/            páginas (inicio, /jugar)
src/components/     componentes reutilizables (botones de tiendas…)
src/config/         configuración centralizada (enlaces de tiendas)
src/i18n/           textos en español e inglés
src/lib/            utilidades (detección de plataforma)
tests/              pruebas unitarias
docs/               decisiones y documentación
```

## Documentación

- [Decisiones aprobadas](docs/DECISIONES.md)
