# Prompt de IA: retrato 8-bit para el hover de la foto

Este documento contiene el prompt para generar tu retrato en pixel art a partir
de una foto tuya, y cómo integrarlo en la página.

## Cómo usarlo

1. Usa un generador que acepte **imagen de referencia** (recomendados:
   Gemini con generación de imágenes / "nano banana", GPT-Image de OpenAI,
   o Recraft). Sube una foto frontal tuya, bien iluminada, de hombros hacia
   arriba, y pega el prompt de abajo.
2. Genera varias variantes y elige la que mejor conserve tus rasgos
   (pelo, barba, forma de cara) sin perder el estilo del sprite existente.
3. Exporta como **PNG con fondo transparente**. Si el generador no da
   transparencia, pide "solid magenta #FF00FF background" y quítalo después.
4. Guarda el archivo como
   `public/images/profile/pixel-portrait.png`
   y en `src/components/home/HeroSection.tsx` cambia `pixelSrc` de
   `pixel-portrait.svg` a `pixel-portrait.png`.
5. Tu foto real va en `public/images/profile/developer-photo.png`
   (cuadrada o casi cuadrada, mínimo 400×400; el componente hace el
   recorte centrado automáticamente).

## El prompt (pégalo en inglés)

```text
Create a retro pixel art bust portrait (head and shoulders) of the person
in the reference photo, in the style of a 16-bit SNES-era Mega Man X
character portrait.

Style requirements:
- True pixel art on a logical grid of about 48x48 pixels, upscaled with
  crisp hard edges (nearest neighbor, no anti-aliasing, no gradients,
  no blur).
- Front-facing, slight friendly smile, looking at the viewer.
- 1-pixel black outline around the whole figure.
- Flat cel shading with at most 2 shades per material.

Exact color palette (use ONLY these colors plus black and white):
- Armor / clothing main: #12D5CD (cyan)
- Armor / clothing shadow: #0F71DE (blue)
- Skin: #F0B281
- Hair, beard and outlines: #000000
- Eye whites and highlights: #FFFFFF

Character details (match the reference photo):
- Keep the person's real hairstyle, beard shape, and face proportions,
  translated into chunky 8-bit pixels.
- Shoulders wear a cyan Mega Man X style armor chest piece with blue
  shading, matching the palette above.

Composition:
- Bust framing centered, sized to fit inside a circular crop without
  cutting the top of the hair.
- Transparent background. No text, no logo, no border, no background
  scenery.
```

## Verificación tras generar

- La rejilla debe ser regular: si hay "píxeles" de tamaños mezclados o
  suavizado, pide regenerar con "strict uniform pixel grid, no
  anti-aliasing".
- Comprueba que los colores sean los de la paleta (cuentagotas sobre la
  armadura: debe dar `#12D5CD`/`#0F71DE`). Si no, pide "quantize strictly
  to the given 5-color palette".
- El PNG final puede ser 480×480 o 960×960 (múltiplos exactos de 48
  conservan los píxeles nítidos). El componente ya lo renderiza con
  `image-rendering: pixelated`.
