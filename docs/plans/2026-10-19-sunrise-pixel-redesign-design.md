# Rediseño "Amanecer" 16-bit — Diseño

Fecha: 2026-10-19 · Estado: aprobado

## Contexto
El hero ahora usa el SVG animado `src/assets/hero-city.svg` (handoff de Claude Design:
pixel art 16-bit, héroe sin casco en una azotea mirando un amanecer sobre una ciudad
futurista, viewBox 240×136). El resto de la web conserva la estética anterior (cian neón,
cards redondeadas con glass/blur) y no combina. Además la escena ocupa casi toda la
pantalla y el cuadro con el nombre queda desplazado debajo.

Objetivo: alinear **toda la web** al estilo gráfico del SVG, achicar la escena y
reorganizar el hero, manteniendo la temática Mega Man.

## 1. Paleta (tokens extraídos del SVG)
| Rol | Valor | Origen |
|---|---|---|
| Fondo base | `#0a0d1f` | azotea |
| Superficie | `#151d44`, `#191a44` | cielo alto / edificios medios |
| Borde | `#2c2b66`, `#3a3a7a` | cantos de edificios |
| Primario | `#5cbdf5`, fuerte `#0b4ad0`, medio `#3480c4`, oscuro `#152a78` | armadura |
| Acento cálido | `#f8a862`, `#e9785f`, rosa `#bb526b` | atardecer |
| Alerta | `#ff4a5e` | balizas |
| Energía | `#39FF14` (se mantiene) | barras HP/EXP |
| Texto | `#f2f5fb`, secundario `#c8d4f0` | |

El cian neón `#00D4FF` se retira; su rol lo toma `#5cbdf5`. Contraste AA a verificar
para texto secundario sobre las superficies.

## 2. Lenguaje visual
- **PixelFrame**: componente de marco reutilizable. Sin `border-radius` ni
  `backdrop-filter`. Esquinas escalonadas (clip-path de 2–4px), borde doble
  (claro exterior / oscuro interior) y sombra dura desplazada 4px sin blur.
- **Tramas**: fondos de sección con bandas de dither tipo cielo del SVG
  (gradientes con patrón de tablero de 2px); estrellas fijas que titilan por frames.
- **Tipografía**: títulos de sección en `Press Start 2P`; cuerpo Rajdhani; diálogo en mono.
  Fuente pixel mínimo 12px (regla previa de accesibilidad).
- **Movimiento**: animaciones por pasos (`steps()` / frames discretos), sin easing suave;
  respetar `prefers-reduced-motion`.

## 3. Home — pantalla + panel lateral
Grid dentro de un contenedor de ~1280px:
- **Izquierda (~60%)**: marco tipo monitor con el SVG a escala entera ×3 (720×408) cuando
  el ancho lo permite. Debajo, tira de estado `PLAYER 1 · STAGE: BASE · ● EN LÍNEA`.
- **Derecha (~40%)**: panel de selección de personaje: retrato (PixelMorphPhoto), nombre,
  clase con typewriter, barras HP/EXP horizontales segmentadas y menú de CTAs con cursor ▶.
- **Abajo (ancho completo)**: cuadro de diálogo con la descripción (typewriter, click-to-skip).
- Los overlays de HUD salen del arte.
- 1440×900: todo visible sin scroll.
- Móvil (≤768px): escena → panel → diálogo, apilados.

Se reutilizan `GameScene` (solo la escena), `DialogBox` (se divide en panel + diálogo) y
`HeroSection` (layout).

## 4. Resto de la web
- **Compartidos**: NavBar sólida con borde pixel inferior; SectionTitle pixel con flicker
  READY; Card → PixelFrame; Button al estilo de opción de menú; Footer con silueta de
  skyline; LoadingScreen con "AB DEV", barra segmentada y paleta nueva (hoy dice "X DEV").
- **Poderes**: barras segmentadas tipo HP; panel de armadura en PixelFrame.
- **Misiones**: experiencias como stages en un mapa de niveles (línea de ruta con nodos).
- **Etapas**: grilla tipo stage select.
- **Contacto**: formulario como terminal de transmisión.
- **Home "Estado de combate"**: revisar que aparezca (en capturas quedó vacía) y restilizar.

## Enfoque de implementación
1. Tokens del theme + estilos globales.
2. `PixelFrame` y componentes compartidos.
3. Hero de la Home.
4. Páginas internas una por una.

El cambio de tokens propaga la paleta de golpe; cada página luego solo requiere ajustes
de layout.

## Verificación
`tsc -b`, `eslint`, y capturas con Playwright a 1440×900 y 390×844 de cada ruta
(`#/`, `#/about`, `#/skills`, `#/experience`, `#/projects`, `#/contact`), revisando
la consola sin errores.

## As-built (2026-10-19)
Diferencias entre este diseño y lo implementado:
- **Fuente pixel**: Silkscreen (Press Start 2P no tenía mayúsculas acentuadas). Toda
  etiqueta en fuente pixel mide ≥14px.
- **Marcos**: no hay componente `PixelFrame`; son helpers de `src/styles/pixel.ts`
  (`pixelCard`, `pixelCardShadow`, contornos con `box-shadow`), sin `clip-path`.
- **Eliminados**: `Card`, `SkillCard` y `ContactForm`.
- **Contacto**: la "terminal" son tiles de información + CTA `mailto:` (sin formulario).
- **Compartidos**: `SegmentBar` e `InfoTile`; hooks `useFocusTrap` y `useScrollLock`;
  enlaces sociales en `data/social.ts`.
- **Hero**: incluye una fila EQUIPPED (enlaza a habilidades).
- **Experiencia**: etiquetas "MISIÓN 0N".
- **Animaciones**: solo escalonadas (`stepEase`, `windowEntry`), respetando
  `prefers-reduced-motion`.
- **Foto**: `developer-photo.png` aún no existe; `HeroPanel` no la pasa
  (`PROFILE_PHOTO = undefined`) y solo se muestra el retrato pixel, sin morph.
