import { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { useInView, useReducedMotion } from 'framer-motion';
import { theme } from '../../styles/theme';
import { segmentCell } from '../../styles/pixel';

const FILL_STEP_MS = 90;

type Orientation = 'horizontal' | 'vertical';

const isStyleProp = (prop: string) => ['orientation', 'cells', 'filled', 'tone'].includes(prop);

const Track = styled('div', { shouldForwardProp: (prop) => !isStyleProp(prop) })<{
  orientation: Orientation;
  cells: number;
}>`
  gap: 2px;
  padding: 2px;
  background: ${theme.colors.neutral.black};
  ${props =>
    props.orientation === 'horizontal'
      ? `
    display: grid;
    grid-template-columns: repeat(${props.cells}, minmax(0, 1fr));
  `
      : `
    display: flex;
    flex-direction: column-reverse;
  `}
`;

const Cell = styled('span', { shouldForwardProp: (prop) => !isStyleProp(prop) })<{
  filled: boolean;
  tone: string;
  orientation: Orientation;
}>`
  display: block;
  height: 10px;
  ${props => (props.orientation === 'vertical' ? 'width: 24px;' : '')}
  ${props => segmentCell(props.filled, props.tone)}
`;

interface SegmentBarProps {
  cells: number;
  filled: number;
  tone: string;
  orientation?: Orientation;
  // Fill one cell at a time (stepped) once the bar scrolls into view
  animateOnView?: boolean;
  startDelayMs?: number;
}

// Decorative HP-style segmented bar; the value must be conveyed by visible text elsewhere.
// Vertical bars fill bottom-up. Reduced motion shows the bar full immediately.
export const SegmentBar: React.FC<SegmentBarProps> = ({
  cells,
  filled,
  tone,
  orientation = 'horizontal',
  animateOnView = false,
  startDelayMs = 0,
}) => {
  const target = Math.max(0, Math.min(cells, Math.round(filled)));
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const [lit, setLit] = useState(0);
  // Last lit count, so toggling reduced motion never restarts a finished fill
  const litRef = useRef(0);

  useEffect(() => {
    if (!animateOnView || target <= 0) return;
    let count = litRef.current;
    if (count >= target) return;

    if (reduced) {
      // Mirror the instantly full bar into state so a later toggle doesn't refill
      const sync = setTimeout(() => {
        litRef.current = target;
        setLit(target);
      }, 0);
      return () => clearTimeout(sync);
    }

    if (!inView) return;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      count += 1;
      litRef.current = count;
      setLit(count);
      if (count < target) timer = setTimeout(tick, FILL_STEP_MS);
    };
    timer = setTimeout(tick, count === 0 ? startDelayMs : FILL_STEP_MS);
    return () => clearTimeout(timer);
  }, [animateOnView, inView, reduced, target, startDelayMs]);

  const shown = !animateOnView || reduced ? target : Math.min(lit, target);

  return (
    <Track ref={ref} orientation={orientation} cells={cells} aria-hidden="true">
      {Array.from({ length: cells }, (_, i) => (
        <Cell key={i} filled={i < shown} tone={tone} orientation={orientation} />
      ))}
    </Track>
  );
};

export default SegmentBar;
