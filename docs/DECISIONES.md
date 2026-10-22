# Decisiones del proyecto

Registro de lo aprobado. Cada cambio de rumbo se anota aquí con su fecha.

## 2026-10-22 — Fase 0 aprobada

| # | Tema | Decisión |
|---|------|----------|
| 1 | Repositorios | Juego Unity en `mao2319/patriamilagrogame` (carpeta local `C:\Projects\patriamilagrounity\My project`). Portal web en `mao2319/patriamilagroweb`. |
| 2 | Versión de Unity | **Unity 6.3 LTS (6000.3.27f1)**, soportada hasta dic. 2027. Se empezó con 6.6, pero su instalación estaba incompleta y no compilaba; el 2026-10-22 se cambió a la LTS. Instalada en `C:\Unity\Editors`. |
| 3 | Paquetes experimentales | Se conservan `com.unity.pipeline` (exp; lo usa la Unity CLI para manejar el editor) y `com.unity.ai.assistant` (pre). |
| 4 | Mensaje de captura | Al capturar a un delincuente, el presidente dice: «Bienvenido a la Patria Milagro, {nombre del capturado}» / «Welcome to Patria Milagro, {captured name}». |
| 5 | Chat | Chat sencillo: abrir, escribir y enviar; el mensaje queda visible para los demás usuarios. Requiere tiempo real (Supabase Realtime) y moderación básica (filtro, reporte). |
| 6 | Trampas | Los delincuentes las colocan; el jugador puede **intentar desactivarlas**. Demo: hueco camuflado, red y bomba con temporizador. Versión completa: además carro bomba y moto bomba con activación remota. Estilo caricaturesco, sin violencia gráfica. |
| 7 | Audio del mapa | Sin música en esta versión: ambiente de ciudad (buses, carros, pitos, gente). |
| 8 | Música administrable por mapa | Fase posterior (módulo de administración). |
| 9 | Hosting | Vercel (equipo `capital-games`) para el portal; Supabase (proyecto `lfnkmiouzosyfmhacnxj`) para archivos del build y el chat. |
| 10 | Orientación en celular | Horizontal (recomendado; sin respuesta explícita). |
| 11 | Enlaces de tiendas | Arrancan como «Próximamente» hasta que existan las fichas publicadas. |

## Herramientas (MCP) configuradas — 2026-10-22

| MCP | Alcance | Uso |
|---|---|---|
| GitHub | Usuario | Subir el código a los repos. |
| Unity (`unity-editor`) | Carpetas del juego y del portal | Unity CLI oficial (`unity mcp --project-path …`); requiere el editor abierto con `com.unity.pipeline`. |
| Supabase | Carpeta del portal | Proyecto `lfnkmiouzosyfmhacnxj`. Autorizar con `/mcp`. |
| Vercel | Carpeta del portal | Equipo `capital-games`. Autorizar con `/mcp`. |

## Pendiente de confirmar

- Roblox no ejecuta juegos de Unity: el botón apunta a una experiencia construida aparte en Roblox Studio (fuera de este plan).
- Identificador de la app (bundle id) para iOS/Android antes de la primera build móvil.
