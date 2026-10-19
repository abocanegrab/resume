import { useCallback, useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { theme } from '../../styles/theme';
import { dither, pixelFrameShadow } from '../../styles/pixel';

interface PixelMorphPhotoProps {
  photoSrc: string;
  pixelSrc: string;
  alt: string;
  /** Fixed square size in px; overrides the responsive default */
  size?: number;
  showHint?: boolean;
}

type Phase = 'photo' | 'toPixel' | 'pixel' | 'toPhoto';

// Mosaic resolutions the photo steps through before becoming the 8-bit portrait
const PIXEL_STEPS = [64, 32, 16, 8];
const STEP_MS = 100;
const REVERSE_STEP_MS = 60;
const FLASH_MS = 80;
const CANVAS_SIZE = 320;

const PhotoContainer = styled.div`
  position: relative;
  width: 320px;
  height: 320px;
  cursor: pointer;

  &:focus-visible {
    outline-offset: 4px;
  }

  @media (max-width: ${theme.breakpoints.laptop}) {
    width: 260px;
    height: 260px;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 220px;
    height: 220px;
  }
`;

// Square character-select portrait: pixel outline (notched corners) + dark inner line
const PhotoFrame = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 0;
  box-shadow: ${pixelFrameShadow(theme.colors.primary.main)};
  ${dither(theme.colors.secondary.dark, theme.colors.background.card, 4)}
`;

const Layer = styled.div<{ visible: boolean }>`
  position: absolute;
  inset: 0;
  opacity: ${props => (props.visible ? 1 : 0)};

  @media (prefers-reduced-motion: reduce) {
    transition: opacity 0.2s ease;
  }
`;

const PhotoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PixelImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  image-rendering: pixelated;
  padding: 8%;
`;

const MorphCanvas = styled.canvas<{ visible: boolean }>`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: ${props => (props.visible ? 1 : 0)};
`;

const Flash = styled.div<{ isOn: boolean }>`
  position: absolute;
  inset: 0;
  background: #ffffff;
  opacity: ${props => (props.isOn ? 1 : 0)};
  pointer-events: none;
`;

// Online LED in the corner, square like the rest of the HUD
const StatusBadge = styled.div`
  position: absolute;
  bottom: 6px;
  right: 6px;
  width: 12px;
  height: 12px;
  background: ${theme.colors.accent.green};
  box-shadow: 0 0 0 2px ${theme.colors.neutral.black};
`;

const HintText = styled.span<{ visible: boolean }>`
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  font-family: ${theme.typography.fonts.mono};
  font-size: ${theme.typography.sizes.xs};
  color: ${theme.colors.neutral.silver};
  white-space: nowrap;
  opacity: ${props => (props.visible ? 0.85 : 0)};
  transition: opacity 0.3s ease;
`;

export const PixelMorphPhoto: React.FC<PixelMorphPhotoProps> = ({
  photoSrc,
  pixelSrc,
  alt,
  size,
  showHint = true,
}) => {
  const [phase, setPhase] = useState<Phase>('photo');
  const [flashOn, setFlashOn] = useState(false);
  const [photoFailed, setPhotoFailed] = useState(false);
  const reduced = useReducedMotion();
  const { t } = useTranslation('home');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoImgRef = useRef<HTMLImageElement | null>(null);
  const timersRef = useRef<number[]>([]);

  const photoReady = useCallback(
    () =>
      photoImgRef.current !== null &&
      photoImgRef.current.complete &&
      photoImgRef.current.naturalWidth > 0,
    []
  );

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(id => clearTimeout(id));
    timersRef.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const drawPixelated = useCallback((res: number) => {
    const canvas = canvasRef.current;
    const img = photoImgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Center-crop the photo to a square, downscale, then blocky upscale
    const off = document.createElement('canvas');
    off.width = res;
    off.height = res;
    const octx = off.getContext('2d');
    if (!octx) return;
    const s = Math.min(img.naturalWidth, img.naturalHeight);
    const sx = (img.naturalWidth - s) / 2;
    const sy = (img.naturalHeight - s) / 2;
    octx.drawImage(img, sx, sy, s, s, 0, 0, res, res);

    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.drawImage(off, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
  }, []);

  const activate = useCallback(() => {
    if (photoFailed) return;
    clearTimers();
    if (reduced || !photoReady()) {
      setPhase('pixel');
      return;
    }
    setPhase('toPixel');
    PIXEL_STEPS.forEach((res, i) => {
      timersRef.current.push(window.setTimeout(() => drawPixelated(res), i * STEP_MS));
    });
    const total = PIXEL_STEPS.length * STEP_MS;
    timersRef.current.push(window.setTimeout(() => setFlashOn(true), total));
    timersRef.current.push(
      window.setTimeout(() => {
        setFlashOn(false);
        setPhase('pixel');
      }, total + FLASH_MS)
    );
  }, [photoFailed, reduced, clearTimers, drawPixelated, photoReady]);

  const deactivate = useCallback(() => {
    if (photoFailed) return;
    clearTimers();
    setFlashOn(false);
    if (reduced || !photoReady()) {
      setPhase('photo');
      return;
    }
    setPhase('toPhoto');
    const reversed = [...PIXEL_STEPS].reverse();
    reversed.forEach((res, i) => {
      timersRef.current.push(
        window.setTimeout(() => drawPixelated(res), i * REVERSE_STEP_MS)
      );
    });
    timersRef.current.push(
      window.setTimeout(() => setPhase('photo'), reversed.length * REVERSE_STEP_MS)
    );
  }, [photoFailed, reduced, clearTimers, drawPixelated, photoReady]);

  const handleClick = useCallback(() => {
    // Touch devices have no hover: tap toggles the effect
    if (!window.matchMedia('(hover: none)').matches) return;
    if (phase === 'photo' || phase === 'toPhoto') {
      activate();
    } else {
      deactivate();
    }
  }, [phase, activate, deactivate]);

  const showPixel = photoFailed || phase === 'pixel';
  const showCanvas = phase === 'toPixel' || phase === 'toPhoto';
  const showPhoto = !photoFailed && (phase === 'photo' || showCanvas);

  return (
    <PhotoContainer
      role="img"
      aria-label={alt}
      tabIndex={0}
      style={size ? { width: size, height: size } : undefined}
      onMouseEnter={activate}
      onMouseLeave={deactivate}
      onFocus={activate}
      onBlur={deactivate}
      onClick={handleClick}
    >
      <PhotoFrame>
        <Layer visible={showPhoto} aria-hidden="true">
          {!photoFailed && (
            <PhotoImage
              ref={photoImgRef}
              src={photoSrc}
              alt=""
              onError={() => setPhotoFailed(true)}
            />
          )}
        </Layer>

        <Layer visible={showPixel} aria-hidden="true">
          <PixelImage src={pixelSrc} alt="" />
        </Layer>

        <MorphCanvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          visible={showCanvas}
          aria-hidden="true"
        />

        <Flash isOn={flashOn} aria-hidden="true" />
      </PhotoFrame>

      <StatusBadge aria-hidden="true" />

      {showHint && (
        <HintText visible={!photoFailed && phase === 'photo'} aria-hidden="true">
          {t('hero.hintPhoto')}
        </HintText>
      )}
    </PhotoContainer>
  );
};

export default PixelMorphPhoto;
