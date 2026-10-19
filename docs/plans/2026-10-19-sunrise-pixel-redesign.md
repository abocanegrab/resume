# Rediseño "Amanecer" 16-bit — Plan de implementación

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Alinear toda la web al estilo pixel art del SVG `hero-city.svg` (paleta de amanecer,
marcos 16-bit) y reorganizar el hero como "pantalla + panel lateral".

**Architecture:** Los colores ya pasan casi todos por `src/styles/theme.ts`, así que primero
se cambian los *valores* de los tokens (sin renombrar, para no romper consumidores) y se
agregan tokens nuevos. Luego un helper `pixelFrame()` en `src/styles/pixel.ts` reemplaza los
bordes redondeados/glass en cada componente. Después el hero, y al final cada página.

**Tech Stack:** React 19, Emotion (`@emotion/styled`), Framer Motion, react-i18next, Vite 7, TS 5.9
(`noUnusedLocals`, `verbatimModuleSyntax`). Router: `HashRouter` (rutas `#/skills`, etc.).

**Diseño aprobado:** `docs/plans/2026-10-19-sunrise-pixel-redesign-design.md`

---

## Verificación (no hay framework de tests)
El proyecto no tiene tests unitarios; la verificación de cada tarea es:
1. `npx tsc -b` → sin salida (exit 0)
2. `npx eslint <archivos tocados>` → sin errores
3. Capturas Playwright en `http://localhost:5180/resume/#/<ruta>` a 1440×900 y 390×844
   (esperar ~3s la LoadingScreen en la primera carga) y consola sin errores.

Reglas del repo a respetar:
- Animaciones por frames discretos (`steps()`, `step-end`), sin easing suave.
- Nunca `Math.random` en render (regla de lint): usar PRNG sembrado como en el GameScene previo.
- Fuente pixel ≥ 12px. Contraste AA en texto.
- No modificar el contenido de `src/assets/hero-city.svg` (solo atributos raíz en runtime).

---

### Task 1: Tokens de paleta "Amanecer"

**Files:**
- Modify: `src/styles/theme.ts` (bloque `colors`, `shadows.glow`)

**Step 1: Reemplazar valores de color** (mismos nombres de clave + claves nuevas)

```ts
primary: {
  main: '#5cbdf5',   // armadura azul claro (antes cian neón)
  dark: '#3480c4',
  light: '#9ad8fa',
  deep: '#0b4ad0',
  glow: 'rgba(92, 189, 245, 0.45)',
},
secondary: {
  main: '#2c2b66',   // canto de edificio
  dark: '#0a0d1f',   // azotea
  medium: '#3a3a7a',
  light: '#55347a',
},
accent: {
  green: '#39FF14',
  pink: '#bb526b',
  gold: '#f8a862',   // sol / atardecer
  orange: '#e9785f',
  red: '#ff4a5e',    // balizas
},
neutral: {
  black: '#0b0b10',
  darkGray: '#151d44',
  gray: '#222a5c',
  lightGray: '#8f97c4',
  silver: '#c8d4f0',
  white: '#f2f5fb',
},
background: {
  primary: '#0a0d1f',
  secondary: '#151d44',
  card: '#191a44',
  overlay: 'rgba(10, 13, 31, 0.92)',
},
sky: ['#0d1430', '#151d44', '#222a5c', '#35306e', '#55347a', '#86406f', '#bb526b', '#e9785f', '#f8a862'],
gradients: {
  primary: 'linear-gradient(90deg, #0b4ad0 0%, #5cbdf5 100%)',
  energyBar: 'linear-gradient(90deg, #5cbdf5 0%, #39FF14 100%)',
  heroBackground: 'linear-gradient(180deg, #0d1430 0%, #222a5c 55%, #55347a 100%)',
  cardHover: 'linear-gradient(135deg, rgba(92, 189, 245, 0.12) 0%, rgba(248, 168, 98, 0.06) 100%)',
  scanline: 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15) 1px, transparent 1px, transparent 2px)',
},
```

`shadows.glow.cyan` → `'0 0 0 2px rgba(92, 189, 245, 0.35)'` (sin halo difuso);
`shadows.glow.pink` → `'0 0 0 2px rgba(187, 82, 107, 0.4)'`. Agregar
`shadows.pixel: '4px 4px 0 #0b0b10'`.

**Step 2: Reemplazar literales `rgba(0, 212, 255, …)` por `rgba(92, 189, 245, …)`**

Run: `grep -rln "0, 212, 255" src | xargs sed -i 's/0, 212, 255/92, 189, 245/g'`
Luego: `grep -rn "0, 212, 255\|00D4FF" src` → solo puede quedar `src/data/skills.ts` (color de marca de una tecnología; revisar y dejar si es un logo).

**Step 3: Verificar** `npx tsc -b` y captura de `#/` y `#/skills`: todo debe verse azul armadura, ya no cian neón.

**Step 4: Commit** `git commit -am "style(theme): sunrise palette tokens from hero-city art"`

---

### Task 2: Helpers pixel + estilos globales

**Files:**
- Create: `src/styles/pixel.ts`
- Modify: `src/styles/globalStyles.ts`

**Step 1: Crear `src/styles/pixel.ts`**

```ts
import { theme } from './theme';

// Stepped 4px corners like SNES menu windows
export const pixelCorners = (step = 4) => `
  clip-path: polygon(
    0 ${step}px, ${step}px ${step}px, ${step}px 0,
    calc(100% - ${step}px) 0, calc(100% - ${step}px) ${step}px, 100% ${step}px,
    100% calc(100% - ${step}px), calc(100% - ${step}px) calc(100% - ${step}px), calc(100% - ${step}px) 100%,
    ${step}px 100%, ${step}px calc(100% - ${step}px), 0 calc(100% - ${step}px)
  );
`;

type FrameTone = 'blue' | 'sunset' | 'muted';

const toneBorder: Record<FrameTone, string> = {
  blue: theme.colors.primary.main,
  sunset: theme.colors.accent.gold,
  muted: theme.colors.secondary.medium,
};

// Window frame: light outer line, dark inner line, flat fill, hard shadow via drop-shadow
// (box-shadow is clipped by clip-path, so the shadow lives on a filter)
export const pixelFrame = (tone: FrameTone = 'blue') => `
  position: relative;
  background: ${theme.colors.background.card};
  border: 2px solid ${toneBorder[tone]};
  box-shadow: inset 0 0 0 2px ${theme.colors.neutral.black};
  border-radius: 0;
  ${pixelCorners()}
`;

export const pixelShadowWrap = `filter: drop-shadow(4px 4px 0 ${theme.colors.neutral.black});`;

// 2px checkerboard dither between two colors (like the sky bands in the SVG)
export const dither = (a: string, b: string, size = 4) => `
  background-color: ${a};
  background-image:
    linear-gradient(45deg, ${b} 25%, transparent 25%, transparent 75%, ${b} 75%),
    linear-gradient(45deg, ${b} 25%, transparent 25%, transparent 75%, ${b} 75%);
  background-size: ${size}px ${size}px;
  background-position: 0 0, ${size / 2}px ${size / 2}px;
`;

// Horizontal segmented bar cells (HP style)
export const segmentCell = (filled: boolean, tone: string) => `
  background: ${filled
    ? `linear-gradient(180deg, #ffffff 0 25%, ${tone} 25% 100%)`
    : theme.colors.neutral.gray};
`;
```

**Step 2: globalStyles**
- `body`: `background-color: ${theme.colors.background.primary}` + capa fija de estrellas:
  agregar `body::after` con `position: fixed; inset: 0; z-index: -1; pointer-events: none;`
  y `background-image` de ~12 `radial-gradient(1px 1px at X% Y%, #c8d4f0 99%, transparent)`
  con posiciones fijas (literales, no aleatorias) + `animation: twinkle 3s steps(2) infinite` a opacidad 0.6↔1.
- `h2`: `font-family: ${theme.typography.fonts.pixel}; font-size: clamp(1.1rem, 2.4vw, 1.75rem); letter-spacing: 0.04em; line-height: 1.4;`
  (h1 se queda en Orbitron).
- Scrollbar thumb: `border-radius: 0`, color `primary.dark`.
- `code, pre`: `border-radius: 0`.
- `a:hover`: quitar `text-shadow`, usar `color: ${theme.colors.accent.gold}`.
- `@keyframes energyPulse` → usar `steps(2)` en vez de suavizado (donde se aplique).

**Step 3: Verificar** tsc + captura `#/experience` (títulos h2 ya en fuente pixel, estrellas de fondo).

**Step 4: Commit** `style(global): pixel helpers, starfield and pixel headings`

---

### Task 3: Componentes compartidos (Card, Button, SectionTitle, LanguageSwitcher)

**Files:**
- Modify: `src/components/common/Card.tsx`, `Button.tsx`, `SectionTitle.tsx`, `LanguageSwitcher.tsx`

**Card:** en las 3 variantes usar `${pixelFrame('muted')}` (`bordered` → `pixelFrame('blue')`,
`glass` → igual que default; eliminar `backdrop-filter`). Envolver el `StyledCard` en un
`div` con `${pixelShadowWrap}` para la sombra dura. Hover: borde pasa a `primary.main` por
`steps(1)` (sin transform de escala suave; si usa `cardHover` variant, reemplazar por
`whileHover={{ y: -4 }}` con `transition={{ type: 'tween', ease: 'steps(2)' as never }}` o
directamente un `:hover { transform: translate(-2px,-2px) }` CSS).

**Button:** estilo opción de menú: fondo `secondary.dark`, borde 2px, `pixelCorners(3)`,
`font-family: pixel` 12px, primario = fondo `primary.deep` texto blanco; hover → fondo
`primary.main` texto `neutral.black` + `▶` a la izquierda. Quitar glow/radius.

**SectionTitle:** el `::after` subrayado pasa a una fila de 3 bloques de 8×8 (`primary.main`,
`accent.gold`, `accent.pink`) vía `box-shadow` escalonado, sin radius. El Decorator `//` → `▶`
en `accent.gold`. Mantener `readyFlicker`.

**LanguageSwitcher:** sin radius, borde 2px `secondary.medium`, activo con fondo `primary.deep`.

**Verificar:** capturas `#/skills` y `#/projects`. **Commit:** `style(common): pixel frame cards, menu buttons, section titles`

---

### Task 4: NavBar, Footer, LoadingScreen

**Files:**
- Modify: `src/components/common/NavBar.tsx`, `Footer.tsx`, `LoadingScreen.tsx`

**NavBar:** fondo sólido `background.primary` con `border-bottom: 2px solid secondary.medium`
y debajo una línea de 2px dither (`dither(primary.deep, secondary.dark)`), sin blur ni
radius. Link activo: color `primary.main` + subrayado de bloques 4px; hover → `accent.gold`.
Logo "AB DEV" se mantiene.

**Footer:** agregar en la parte superior una tira de skyline pixel (reutilizar la función
`buildSkyline` con PRNG sembrado que existía en `GameScene.tsx` antes del commit `2ed46b6`;
recuperarla con `git show 0f04249:src/components/home/GameScene.tsx`) en colores
`#191a44`/`#0c0f26` con ventanas `#5cbdf5`/`#f8b06a`, altura 64px, estática. Quitar radius.

**LoadingScreen:** texto "X DEV" → "AB DEV" (la "AB" en `primary.main`, igual que el logo del
NavBar). Barra de progreso → 16 celdas segmentadas (`segmentCell`) que se llenan por pasos.
Partículas → estrellas cuadradas 2px. Fondo `dither` de las 2 primeras bandas del cielo.

**Verificar:** recarga completa (ver LoadingScreen), captura de footer en `#/contact`.
**Commit:** `style(chrome): pixel navbar, skyline footer, AB DEV loading screen`

---

### Task 5: Hero — pantalla + panel lateral (Home)

**Files:**
- Modify: `src/components/home/GameScene.tsx` (solo escena en marco monitor + tira de estado)
- Create: `src/components/home/HeroPanel.tsx` (retrato, nombre, clase, HP/EXP, CTAs)
- Modify: `src/components/home/DialogBox.tsx` (solo descripción con typewriter)
- Modify: `src/components/home/HeroSection.tsx` (grid)
- Modify: `src/components/home/index.ts` (export HeroPanel)
- Modify: `src/locales/{en,es}/home.json` (claves `hero.player`, `hero.stage`)

**Step 1: i18n**
- es: `"player": "JUGADOR 1"`, `"stage": "ESCENARIO: BASE"`
- en: `"player": "PLAYER 1"`, `"stage": "STAGE: BASE"`

**Step 2: GameScene** — quitar `Hud`, `HudBar`, `BarColumn`, `BarTrack`, `BarCell`,
`HudLabel`, `StatusTag` (se mudan al panel/tira). Estructura:

```tsx
<Monitor>                       // pixelFrame('blue') + pixelShadowWrap en wrapper
  <Screen ref={artRef} dangerouslySetInnerHTML={{ __html: HERO_SVG }} />  // aspect-ratio 240/136
</Monitor>
<StatusStrip>                   // pixel 12px: JUGADOR 1 · ESCENARIO: BASE · ● EN LÍNEA
```

`HERO_SVG` ahora con `preserveAspectRatio="xMidYMid meet"` (el marco ya tiene la proporción
exacta, no hace falta slice). `Screen`: `width: 100%; aspect-ratio: 240 / 136;`.
Mantener el `useEffect` de reduced-motion.

**Step 3: HeroPanel** — mover desde DialogBox: `PixelMorphPhoto` (size 120), `SpeakerName`
(h1, Orbitron), `RoleLine` con typewriter de roles (mover el `useEffect` de roles tal cual),
barras HP/EXP horizontales de 16 celdas con `segmentCell` (HP 16/16 `primary.main`,
EXP 14/16 `accent.green`), y `Options` en columna con cursor ▶ (mismo `optionStyles`).
Contenedor: `pixelFrame('blue')`, padding 24px, `display:flex; flex-direction:column; gap:16px`.

**Step 4: DialogBox** — queda solo con el `Typewriter` de la descripción, click-to-skip y
un "hablante" a la izquierda: etiqueta pixel `AARÓN:` en `accent.gold`. Marco
`pixelFrame('sunset')`. Eliminar margin negativo.

**Step 5: HeroSection**

```tsx
const HeroGrid = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: calc(${theme.spacing['3xl']} + ${theme.spacing.lg}) ${theme.spacing.lg} ${theme.spacing.xl};
  display: grid;
  grid-template-columns: minmax(0, 720px) minmax(300px, 1fr);
  grid-template-areas: 'scene panel' 'dialog dialog';
  gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.laptop}) {
    grid-template-columns: 1fr;
    grid-template-areas: 'scene' 'panel' 'dialog';
  }
`;
```

Fondo de la sección: `dither` entre `sky[0]` y `sky[1]` en la parte superior que transiciona
a `background.primary` (gradiente encima del dither).

**Step 6: Verificar** a 1440×900: escena ≈720×408, panel a la derecha, diálogo visible
**sin scroll**. A 390×844: escena → panel → diálogo, nada tapa al personaje.
tsc + eslint de los 5 archivos.

**Step 7: Commit** `feat(home): monitor scene + character select panel hero layout`

---

### Task 6: Home — "Estado de combate"

**Files:** Modify `src/pages/HomePage.tsx`

- Diagnosticar por qué la sección se ve vacía (probable: `whileInView` en StatCard con
  `opacity:0` y la captura full-page no dispara intersección). Verificar haciendo scroll real
  con Playwright; si aparece, no es bug. Si no aparece, revisar `viewport` / overflow.
- `StatCard` → `pixelFrame('muted')`; barras verticales pasan a 10 celdas discretas que se
  llenan por pasos (reemplazar `EnergyBarFill` animado en altura por celdas con `segmentCell`
  y `transition` con `steps`). E-Tank: quitar radius, hacerlo con bloques.
- `StatsHUD` fondo: `dither(sky[0], background.primary)`; borde superior 2px `primary.main`.

**Commit:** `style(home): pixel combat-status HUD`

---

### Task 7: Poderes (`#/skills`)

**Files:** `src/components/skills/SkillBar.tsx`, `SkillCard.tsx`, `src/pages/SkillsPage.tsx`

- SkillBar: barra continua → 20 celdas `segmentCell` (llenas = `round(level/5)`), relleno por
  pasos al entrar en viewport. Porcentaje en fuente pixel 12px.
- Filtros (chips redondeados) → pestañas pixel: sin radius, activo con fondo `primary.deep`.
- Panel "Armadura de poder": `pixelFrame('blue')`; fondo del sprite con `dither`.
- SkillCard: `pixelFrame('muted')`.

**Commit:** `style(skills): segmented power bars and pixel tabs`

---

### Task 8: Misiones (`#/experience`)

**Files:** `src/components/experience/ExperienceCard.tsx`, `src/pages/ExperiencePage.tsx`

- Timeline → mapa de stages: línea vertical punteada de bloques 4px (`primary.dark`), cada
  experiencia con un nodo cuadrado 16px (actual = `accent.gold` parpadeando con `step-end`,
  pasadas = `primary.main`) y etiqueta `STAGE 0N` en pixel 12px.
- Card → `pixelFrame('muted')`, tags de tecnologías sin radius con borde 2px.
- Badge "FULL-TIME" → bloque pixel `accent.green` sobre `neutral.black`.

**Commit:** `style(experience): stage-map mission log`

---

### Task 9: Etapas (`#/projects`)

**Files:** `src/components/projects/ProjectCard.tsx`, `ProjectModal.tsx`, `src/pages/ProjectsPage.tsx`

- Grilla tipo stage select: cards `pixelFrame('muted')`, hover → borde `accent.gold` +
  cursor ▶ parpadeante en la esquina; imagen con `image-rendering: pixelated` si es pixel art.
- Modal: `pixelFrame('blue')`, overlay `background.overlay`, botón cerrar como `[X]` pixel.
- Revisar que la página renderice tras navegación hash (en la exploración quedó en blanco
  tras `location.hash`; reproducir con click en el NavBar antes de asumir bug).

**Commit:** `style(projects): stage-select grid and pixel modal`

---

### Task 10: Contacto y Perfil

**Files:** `src/components/contact/ContactForm.tsx`, `SocialLinks.tsx`, `src/pages/ContactPage.tsx`,
`src/components/about/BioCard.tsx`

- ContactForm → terminal de transmisión: marco `pixelFrame('blue')`, cabecera
  `> CANAL ABIERTO_` con cursor `step-end`, inputs sin radius, fondo `neutral.black`, borde
  2px `secondary.medium`, focus `primary.main`. Botón enviar = Button primario.
- SocialLinks: iconos en cuadros 40px sin radius.
- BioCard: `pixelFrame('muted')`, quitar `rgba` glass/blur.

**Commit:** `style(contact,about): transmission terminal and pixel bio card`

---

### Task 11: Barrido final

- `grep -rn "border-radius\|borderRadius\|backdrop-filter" src --include=*.tsx` → revisar cada
  resto; solo se permiten radios en elementos intencionalmente circulares (retrato de
  PixelMorphPhoto, punto de estado).
- Secret pages (`src/components/secret/*`): solo verificar que la paleta nueva no rompa
  contraste; sin cambios de layout.
- Capturas 1440×900 y 390×844 de las 6 rutas; consola sin errores; `npm run build` OK.
- Actualizar memoria `megaman-overhaul-2026-09.md` (o nueva) con el estado del rediseño.

**Commit:** `chore: sunrise redesign cleanup`
