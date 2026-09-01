# Diseño: Overhaul visual Megaman + accesibilidad

Fecha: 2026-09-01
Estado: Aprobado por Aarón

## Objetivo

Elevar la identidad Mega Man del portfolio sin caer en "AI slop", corregir el
contenido en español, rehacer la animación idle del sprite al estilo SNES,
implementar el hover foto real → retrato 8-bit, y cumplir WCAG 2.1 AA.

## Decisiones tomadas

- Efecto de la foto: **pixelación progresiva** en pasos discretos + flash.
- Animación idle: **estilo Mega Man X (SNES)**, frames discretos.
- Alcance: paquete completo (contenido, sprite, foto, accesibilidad, identidad).
- Sonido: fuera de alcance en esta ronda (futuro, con toggle).

## 1. Corrección del español

- Reescribir `src/locales/es/*.json` con ortografía correcta (tildes, eñes):
  "más de 13 años", "máquinas", "Co-fundé", etc.
- Verificar que las fuentes (Rajdhani, Orbitron, Press Start 2P, JetBrains
  Mono) carguen subset `latin-ext`.
- Traducir textos hardcodeados: "[ HOVER FOR X-HUNTER MODE ]",
  "READY"/"STANDBY"/"POWER UP" del sprite, alt de la foto.

## 2. Animación idle del sprite (CharacterSprite)

Reemplazar los tweens suaves de Framer Motion por animación por frames:

- Reloj de frames (~8 fps) con `useEffect` + interval; los grupos del SVG
  cambian de pose de golpe (sin interpolación, sin easing).
- Desplazamientos en píxeles lógicos del sprite: 10 unidades de viewBox = 1
  píxel. Nunca fracciones ni rotaciones sub-pixel.
- Ciclo de respiración (3 poses): neutral → torso/hombros +1px arriba, cabeza
  1px abajo → neutral. Cada pose se sostiene varios frames.
- Parpadeo: rects color piel (`#f0b281`) sobre la zona de ojos durante ~120ms,
  cada 3-4 s con jitter aleatorio.
- Mirada lateral ocasional: pupilas +1px horizontal y de vuelta, cada ~10 s.
- Power-up (hover de skill): flash blanco de 2 frames + swap instantáneo de
  paleta de armadura (sin scale suave).
- `prefers-reduced-motion`: pose estática; solo cambia el color de armadura.

## 3. Hover foto → retrato 8-bit (PixelMorphPhoto)

Nuevo componente que reemplaza el overlay de casco en `ProfilePhoto`:

- Capas: foto real + retrato pixel-art (busto del mismo personaje).
- Hover/focus/tap: pixelación en 4 pasos discretos vía canvas
  (`imageSmoothingEnabled = false`, resoluciones 64→32→16→8, ~100ms por
  paso), flash blanco de 80ms, aparece el retrato 8-bit. Salida inversa rápida.
- Accesible: focusable con teclado, toggle en táctil, `aria-label`
  descriptivo; con `reduced-motion`, crossfade simple.
- Placeholder hasta tener la imagen generada: cabeza del sprite recortada de
  `public/sprites/character.svg`.
- Se entrega un prompt de IA (inglés) para generar el retrato con la foto de
  referencia: busto frontal estilo Mega Man X SNES, rejilla ~48×48, paleta del
  sprite (#12d5cd, #0f71de, #f0b281, #000000), fondo transparente, outline de
  1 píxel, encuadre para marco circular.
- La imagen final vivirá en `public/images/profile/` junto con
  `developer-photo.png` (foto real, hoy inexistente — hay 404 en consola).

## 4. Accesibilidad (WCAG 2.1 AA)

- `prefers-reduced-motion` global: apagar scanlines, pulsos, floating,
  typewriter (mostrar texto completo), transiciones de página a fade.
- Contraste: aclarar `neutral.silver` (#8A8AA0) hasta ≥4.5:1 sobre
  `background.primary/secondary`; auditar texto de botones sobre cyan.
- Tipografía pixel: mínimo 12px (hoy hay labels de 8-10px).
- ARIA: decorativos `aria-hidden`, typewriter con alternativa estática,
  `<html lang>` sincronizado con i18n.
- Fix: wrap del botón "Descargar chip de datos" en desktop.

## 5. Identidad Mega Man

- Transición de página = teleport beam (columna de luz cyan + flash +
  materialización) en `PageTransition`, reemplazando blur/scale genérico.
- NavBar: ítem activo con cursor pixel parpadeante (▶) estilo stage select.
- Títulos de sección: intro con parpadeo de 2-3 frames tipo "READY".
- Barras de energía: afinar ticks y borde estilo HUD del juego.

## Fuera de alcance

- Efectos de sonido (futuro, con toggle de mute).
- Rediseño de contenido de las páginas internas.
