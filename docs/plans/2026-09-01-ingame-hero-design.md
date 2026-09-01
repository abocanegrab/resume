# Diseño: Home como escena in-game

Fecha: 2026-09-01
Estado: Aprobado por Aarón (elegido sobre "stage select" y "split asimétrico")

## Objetivo

Reemplazar el hero clásico de dos columnas por una escena de juego Mega Man X:
sprite en un escenario con parallax + HUD, y la información personal en una
caja de diálogo estilo Dr. Light.

## Estructura

1. **GameScene** (`src/components/home/GameScene.tsx`), full-bleed, ~62vh:
   - Fondo: gradiente + grid actuales, más 2 capas parallax de siluetas de
     edificios pixel-art (SVG de rects generado con PRNG con semilla — nunca
     `Math.random()` en render). Loop CSS translateX (60s/35s, linear);
     reduced-motion las deja estáticas (media query global ya lo cubre).
   - HUD arriba-izquierda: barras segmentadas "ENERGÍA" (llena) y
     "EXP · 13+ AÑOS" (~90%), ticks estilo MMX. Decorativas: `aria-hidden`.
   - Indicador "EN LÍNEA" arriba-derecha.
   - `CharacterSprite` (idle por frames existente) parado sobre un suelo de
     tiles pixel (CSS repeating-gradient) que cruza todo el ancho.
2. **DialogBox** (`src/components/home/DialogBox.tsx`), solapada -40px sobre
   el suelo, max-width 1100px:
   - Retrato izquierda: `PixelMorphPhoto` compacto (~140px) — el efecto
     foto→8-bit vive donde va el retrato del hablante en los diálogos del juego.
   - Encabezado: nombre como `h1` + clase con el typewriter de roles existente.
   - Descripción con typewriter (~20ms/char, una vez; click completa; ▼
     parpadeante al terminar; reduced-motion o click → texto completo).
     Accesible via `aria-label` con el texto completo.
   - CTAs como opciones de diálogo: `▶ VER BATALLAS`, `▶ DESCARGAR CHIP DE
     DATOS`, `▶ CONTACTAR BASE` (links/anchor reales).
3. `HeroSection.tsx` pasa a componer GameScene + DialogBox. El layout de dos
   columnas y `BossSelectFrame` desaparecen. La sección de stats de HomePage
   no cambia.

## Cambios de soporte

- `CharacterSprite` gana prop opcional `showLabels` (default `true`) para
  ocultar "LISTO / [EN ESPERA]" dentro de la escena (skills no cambia).
- i18n: nuevas claves `hero.hud.energy`, `hero.hud.exp` (en/es).
- Móvil: escena ~42vh, diálogo apilado (retrato arriba, más pequeño).

## Verificación

`npm run build` + `npx eslint src` limpios; revisión visual desktop (1440px)
y móvil (375px) en ES; consola sin errores. Commit por tarea.

## Tareas

1. `CharacterSprite`: prop `showLabels`. Build/lint. Commit.
2. i18n: claves HUD en `locales/{en,es}/home.json`. Commit con la tarea 3.
3. `GameScene.tsx` (parallax con PRNG sembrado, HUD, sprite, suelo).
4. `DialogBox.tsx` (retrato, typewriter accesible, opciones de diálogo).
5. Reescribir `HeroSection.tsx`; borrar estilos muertos. Build/lint/visual.
6. Pase visual final ES/EN, desktop/móvil, consola limpia. Commit final.
