# Megaman Visual Overhaul Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Corregir el contenido en español, rehacer la animación idle del sprite al estilo Mega Man X (frames discretos), implementar el hover foto→8-bit por pixelación, cumplir WCAG 2.1 AA y reforzar la identidad Mega Man.

**Architecture:** SPA React 19 + Emotion + Framer Motion + react-i18next. El sprite es `public/sprites/character.svg` (1064 rects de 10×10; 1 píxel lógico = 10 unidades de viewBox). Las animaciones retro se implementan con relojes de frames (setInterval, sin easing) y overlays de rects, no con tweens.

**Tech Stack:** Vite 7, TypeScript 5.9 (`verbatimModuleSyntax`, `noUnusedLocals`), Emotion, Framer Motion 12, i18next.

**Verificación:** no hay framework de tests (no añadir uno — YAGNI). Cada tarea se verifica con `npm run build` (tsc) + `npm run lint` + inspección visual en `http://localhost:5173/resume/` (dev server) con Playwright MCP o navegador. Commit al final de cada tarea.

**Datos del sprite que ya están medidos** (coordenadas viewBox, fills):
- Ojo izquierdo: blancos x160-179, pupila negra x180-199; y130-149.
- Ojo derecho: blanco x230 (`#fff` ¡3 dígitos!), pupila x240-259 (`#000000` y `#000`), blanco x260-269; y130-149.
- Piel `#f0b281`, armadura clara `#12d5cd`, armadura oscura `#0f71de`.
- BUG existente: el parser de `CharacterSprite.tsx` solo reconoce `#ffffff`/`#000000`; los rects `#fff`/`#000` caen al grupo torso. Hay que normalizar hex de 3 dígitos.

---

### Task 1: Ortografía española en locales

**Files:** Modify: `src/locales/es/*.json` (los 7).

1. Leer cada JSON de `src/locales/es/` y corregir TODA la ortografía: tildes, eñes, mayúsculas acentuadas ("más de 13 años", "máquinas de guerra", "Co-fundé", "Misión", "Diseño", etc.). No cambiar claves ni estructura, solo valores. Cuidado con no "corregir" términos técnicos ni nombres propios (Maverick Hunter, .NET, AWS).
2. Verificar en el navegador (idioma ES) que las tildes renderizan en las 4 fuentes (Google Fonts css2 ya sirve latin-ext).
3. `npm run build` → OK. Commit: `fix(i18n): correct Spanish orthography (accents, ñ)`.

### Task 2: Internacionalizar textos hardcodeados

**Files:** Modify: `src/components/home/ProfilePhoto.tsx`, `src/components/skills/CharacterSprite.tsx`, `src/components/home/HeroSection.tsx`, `src/locales/{en,es}/{home,skills}.json`.

1. Añadir claves: `home.hero.hintPhoto` ("[ HOVER: MODO 8-BIT ]" / "[ HOVER: 8-BIT MODE ]"), `home.hero.photoAlt`, `skills.sprite.ready`, `skills.sprite.standby`, `skills.sprite.powerUp`.
2. Usar `useTranslation` en los componentes; el alt de la foto sale de `photoAlt`.
3. Build + verificación visual en ambos idiomas. Commit: `fix(i18n): translate hardcoded UI strings`.

### Task 3: `<html lang>` sincronizado + prefers-reduced-motion global

**Files:** Modify: `src/i18n/index.ts`, `src/styles/globalStyles.ts`.

1. En `i18n/index.ts`: tras `init`, y en el evento `languageChanged`, hacer `document.documentElement.lang = lng`.
2. En `globalStyles.ts` añadir:
   ```css
   @media (prefers-reduced-motion: reduce) {
     *, *::before, *::after {
       animation-duration: 0.01ms !important;
       animation-iteration-count: 1 !important;
       transition-duration: 0.01ms !important;
     }
   }
   ```
   (mata scanlines/pulsos CSS; los relojes de frames JS se apagan por componente con `useReducedMotion` de framer-motion).
3. Build + commit: `feat(a11y): sync html lang and honor prefers-reduced-motion`.

### Task 4: Contraste y tamaños mínimos

**Files:** Modify: `src/styles/theme.ts`, `src/components/home/HeroSection.tsx`, `src/components/common/Button.tsx` (si falla contraste).

1. `neutral.silver`: `#8A8AA0` → `#A5A9C4` (≥4.5:1 sobre `#1A1A2E` y `#0D1B2A`; verificar con fórmula WCAG antes de fijar).
2. `neutral.lightGray` se usa como color de texto (HintText): si queda como texto, mínimo `#8A8FB0`-equivalente que pase 4.5:1; si no, cambiar ese texto a `silver`.
3. Labels con fuente pixel de 8px/10px (`DataLabel`, `RoleLabel`, `CharacterLabel`, `StatusIndicator`) → 12px mínimo (0.75rem). Revisar que no rompa layout.
4. Botón "Descargar chip de datos": añadir `white-space: nowrap` al Button o acortar la etiqueta ES a "Descargar CV" (clave `common.buttons.downloadCV`); decidir por lo que quepa a 1440px y 768px.
5. Comprobar contraste del texto del Button primario (texto sobre cyan `#00D4FF`): si es blanco, cambiar a `#0D1B2A`.
6. Build + visual + commit: `fix(a11y): contrast ratios and minimum pixel-font sizes`.

### Task 5: Idle estilo Mega Man X en CharacterSprite

**Files:** Modify: `src/components/skills/CharacterSprite.tsx`.

Reescribir la parte de animación (mantener SpriteContainer/SkillNameDisplay/StatusText y el fetch del SVG):

1. **Normalizar hex** en `parseSvgToGroups`: función `normalizeHex(f)` que expande `#abc` → `#aabbcc` antes de comparar; añadir `#fff`/`#000` implícitamente resueltos.
2. **Eliminar** los variants suaves (`headAnimation`, `torsoAnimation`, `leftArmAnimation`, `rightArmAnimation`, `powerUpAnimation`) y los `motion.g`.
3. **Reloj de frames** (150ms/frame). Estructura del estado y ciclo:
   ```tsx
   import { useReducedMotion } from 'framer-motion';

   const FRAME_MS = 150;
   interface IdlePose { inhale: boolean; blink: boolean; gaze: boolean }

   // dentro de AnimatedSprite:
   const reduced = useReducedMotion();
   const [pose, setPose] = useState<IdlePose>({ inhale: false, blink: false, gaze: false });

   useEffect(() => {
     if (reduced) return;
     let frame = 0;
     let nextBlink = 20 + Math.floor(Math.random() * 15);
     let blinkEnd = -1;
     let nextGaze = 60 + Math.floor(Math.random() * 30);
     let gazeEnd = -1;
     const id = setInterval(() => {
       frame += 1;
       if (frame === nextBlink) {
         blinkEnd = frame;                       // 1 frame cerrado (~150ms)
         nextBlink = frame + 20 + Math.floor(Math.random() * 15);
       }
       if (frame === nextGaze) {
         gazeEnd = frame + 5;                    // ~750ms mirando de lado
         nextGaze = frame + 60 + Math.floor(Math.random() * 40);
       }
       setPose({
         inhale: frame % 10 >= 6,                // 6 frames exhala, 4 inhala
         blink: frame <= blinkEnd,
         gaze: frame <= gazeEnd,
       });
     }, FRAME_MS);
     return () => clearInterval(id);
   }, [reduced]);
   ```
4. **Render por grupos SIN interpolación** (transform de SVG, salto seco, 1 píxel = 10 unidades):
   - Piernas y torso: estáticos.
   - Brazos: `transform={pose.inhale ? 'translate(0,-10)' : undefined}` (suben al inhalar; el pequeño hueco bajo los puños es aceptable).
   - Cabeza: `transform={pose.inhale ? undefined : 'translate(0,10)'}` (baja 1px al exhalar; al bajar no deja hueco porque la barbilla tapa el torso — NO subirla por encima de la base).
5. **Overlays de ojos DENTRO del grupo cabeza** (así siguen su movimiento):
   ```tsx
   {pose.blink && (
     <>
       <rect x="160" y="130" width="40" height="20" fill="#f0b281" />
       <rect x="230" y="130" width="40" height="20" fill="#f0b281" />
       <rect x="160" y="140" width="40" height="10" fill="#000000" />
       <rect x="230" y="140" width="40" height="10" fill="#000000" />
     </>
   )}
   {!pose.blink && pose.gaze && (
     <>
       <rect x="160" y="130" width="40" height="20" fill="#ffffff" />
       <rect x="230" y="130" width="40" height="20" fill="#ffffff" />
       <rect x="170" y="130" width="20" height="20" fill="#000000" />
       <rect x="230" y="130" width="20" height="20" fill="#000000" />
     </>
   )}
   ```
6. **Power-up por frames** (al cambiar `isCharging` a true): secuencia de 4 frames con un `useEffect` + timeouts múltiplos de FRAME_MS que alterna `filter: 'brightness(0) invert(1)'` (silueta blanca) / normal, y al terminar deja el `drop-shadow` del color nuevo. Sin `scale` ni easing.
7. `reduced === true`: pose estática (sin interval), solo cambia el color de armadura.
8. Verificación visual en /skills: respiración seca tipo SNES, parpadeo ocasional, mirada lateral, flash al hover de skill. Build + lint. Commit: `feat(sprite): frame-based Mega Man X style idle animation`.

### Task 6: PixelMorphPhoto (foto → 8-bit por pixelación)

**Files:** Create: `src/components/home/PixelMorphPhoto.tsx`, `public/images/profile/pixel-portrait.svg` (placeholder). Modify: `src/components/home/HeroSection.tsx`, `src/components/home/index.ts`. Delete usage de `ProfilePhoto` (mantener el archivo hasta el final de la ronda, luego borrar).

1. **Placeholder del retrato**: crear `public/images/profile/pixel-portrait.svg` copiando de `character.svg` solo los rects de la cabeza (fills piel/pelo/ojos con y < 220) con `viewBox="110 0 190 220"`, fondo `rect` transparente. Script Node de un solo uso en scratchpad (no commitearlo).
2. **Componente** — estados `'photo' | 'toPixel' | 'pixel' | 'toPhoto'`; API:
   ```tsx
   interface PixelMorphPhotoProps {
     photoSrc: string;      // foto real
     pixelSrc: string;      // retrato 8-bit
     alt: string;
   }
   ```
   - Canvas 320×320 superpuesto durante `toPixel`/`toPhoto`; dibuja la foto reescalada a resoluciones [64, 32, 16, 8] (offscreen canvas de `res`×`res`, luego `imageSmoothingEnabled = false` y upscale), un paso cada 100ms con setTimeout encadenado; al llegar a 8: div blanco con opacidad 1 durante 80ms y pasar a estado `pixel` (muestra `pixelSrc` con `image-rendering: pixelated`). Salida: secuencia inversa sin flash (rápida, 60ms/paso).
   - Interacción: `onMouseEnter/onMouseLeave`, `onFocus/onBlur` (contenedor con `tabIndex={0}`, `role="img"`, `aria-label={alt}`), y en táctil `onClick` toggle.
   - `useReducedMotion()`: crossfade CSS simple de 200ms entre las dos imágenes, sin canvas ni flash.
   - Mantener el manejo de error de imagen (si `photoSrc` 404 → mostrar directamente `pixelSrc` estático con nota; así desaparece el placeholder "X" y el 404 deja de romper la experiencia).
   - Conservar del componente viejo: marco circular con anillos, StatusBadge, HintText (ahora con la clave i18n de Task 2).
3. En `HeroSection`: reemplazar `<ProfilePhoto>` por `<PixelMorphPhoto photoSrc=".../developer-photo.jpg" pixelSrc=".../pixel-portrait.svg" ... />`.
4. Build + lint + visual (hover, tab, tap con emulación táctil). Commit: `feat(home): pixel-morph photo hover effect`.

### Task 7: Documento con el prompt de IA

**Files:** Create: `docs/ai-prompt-pixel-portrait.md`.

Redactar el prompt final (inglés) + instrucciones de uso en español: modelo sugerido (Gemini/nano-banana o GPT-image con la foto como referencia), specs (busto frontal, estilo Mega Man X SNES, rejilla lógica 48×48, paleta exacta #12d5cd/#0f71de/#f0b281/#000000/#ffffff, outline negro 1px, fondo transparente, PNG con nearest-neighbor, encuadre circular), y cómo colocar el archivo (`public/images/profile/pixel-portrait.png`) y actualizar `pixelSrc`. Commit: `docs: AI prompt for 8-bit portrait generation`.

### Task 8: Teleport beam en PageTransition

**Files:** Modify: `src/components/common/PageTransition.tsx`.

1. Sustituir el overlay de anillo por un **beam**: div fijo centrado de ancho 8px, alto 100vh, `background: linear-gradient(180deg, #66E5FF, #00D4FF)`, `box-shadow` glow.
2. Entrada (mount de página): overlay opaco del color de fondo + beam que aparece (scaleY 0→1 desde arriba, 120ms), flash blanco de 60ms, overlay y beam desaparecen de golpe mientras el contenido aparece con `opacity: [0,1]` en 2 pasos (`ease: steps`-like usando `times: [0, 0.99, 1]` o swap por estado). Total ≤ 450ms.
3. Salida: contenido desaparece de golpe, beam sube (scaleY 1→0, origin top) — como X saliendo del stage.
4. `useReducedMotion`: fade simple 200ms (mantener como variante).
5. Confirmar que TODAS las páginas envuelven con PageTransition (revisar `src/pages/*.tsx`; si alguna no, añadirlo).
6. Build + visual navegando entre páginas. Commit: `feat(ux): Mega Man teleport beam page transition`.

### Task 9: NavBar stage-select + SectionTitle "READY"

**Files:** Modify: `src/components/common/NavBar.tsx`, `src/components/common/SectionTitle.tsx`.

1. NavBar: al ítem activo, anteponer `▶` (span con fuente pixel, 12px, color primary, `animation: blink 1s step-end infinite`, `aria-hidden="true"`). Mantener también el subrayado como refuerzo no-solo-color.
2. SectionTitle: reemplazar el glitch infinito por intro tipo "READY": al entrar en viewport, el título parpadea 3 veces (opacity 0/1 con `step-end`, ~450ms total) y queda fijo. El glitch infinito actual distrae y es hostil para accesibilidad; eliminar `glitchVariants` de aquí (dejar el export en animations.ts si otro sitio lo usa; si nadie más lo usa, borrarlo — `noUnusedLocals` no aplica a exports pero grep primero).
3. Con reduced-motion: sin parpadeo.
4. Build + visual + commit: `feat(ux): stage-select nav cursor and READY title intro`.

### Task 10: Pase ARIA y typewriter accesible

**Files:** Modify: `src/components/home/HeroSection.tsx`, otros componentes con decorativos.

1. `RoleText` (typewriter): contenedor con `aria-label` = rol actual completo y el texto animado con `aria-hidden="true"`; con reduced-motion mostrar el primer rol completo sin animar.
2. `aria-hidden="true"` en: GridPattern, ScanLine, StatusDot/StatusIndicator, Cursor, decoradores `//` de SectionTitle, beam/overlay de PageTransition.
3. Revisar orden de foco del hero (botones alcanzables con Tab, foto focusable ya en Task 6).
4. Build + lint + navegación por teclado completa. Commit: `fix(a11y): aria pass on decorative and animated elements`.

### Task 11: Verificación final

1. `npm run build` y `npm run lint` limpios.
2. Recorrido visual de las 6 páginas + /secret en EN y ES, 1440px y 375px; capturar screenshots.
3. Chequeo rápido de contraste con los valores finales del theme.
4. Confirmar consola sin errores (el 404 de la foto queda resuelto o documentado hasta que el usuario añada su foto real).
5. Commit final si quedaron ajustes: `chore: final polish pass`.
