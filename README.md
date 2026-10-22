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

## Variables de entorno

Ver `.env.example`. Todas son públicas (`NEXT_PUBLIC_`): **nunca** poner secretos aquí.

- `NEXT_PUBLIC_APP_STORE_URL`, `NEXT_PUBLIC_GOOGLE_PLAY_URL`, `NEXT_PUBLIC_ROBLOX_URL`: enlaces a la versión completa. Si faltan o no son del dominio de la tienda, el botón dice «Próximamente».
- `NEXT_PUBLIC_UNITY_BUILD_URL`: carpeta pública del build WebGL (Fase 4).

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
