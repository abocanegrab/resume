import { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HeroSection } from '../components/home/HeroSection';
import { PageTransition } from '../components/common/PageTransition';
import { theme } from '../styles/theme';
import { dither, pixelFrame, pixelFrameShadow, segmentCell } from '../styles/pixel';

const BAR_CELLS = 10;
const FILL_STEP_MS = 90;

// Discrete easing for Framer: jumps in 4 frames, no smooth interpolation
const steps4 = (t: number) => Math.floor(t * 4) / 4;

const HomeContainer = styled.div`
  width: 100%;
`;

// Stats section styled like a Megaman HUD: dithered night band
const StatsHUD = styled.section`
  padding: ${theme.spacing['3xl']} ${theme.spacing.lg};
  ${dither(theme.colors.sky[0], theme.colors.background.primary, 4)}
  border-top: 2px solid ${theme.colors.primary.main};

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing['2xl']} ${theme.spacing.md};
  }
`;

const HUDHeader = styled.div`
  max-width: 1200px;
  margin: 0 auto ${theme.spacing.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.md};
`;

const HUDTitle = styled.h2`
  font-family: ${theme.typography.fonts.pixel};
  font-size: 16px;
  line-height: 1.4;
  color: ${theme.colors.primary.main};
  text-transform: uppercase;
  letter-spacing: 0.15em;
  text-align: center;
  text-shadow: 2px 2px 0 ${theme.colors.primary.deep};
  margin: 0;
`;

// Dotted block line
const HUDLine = styled.div`
  flex: 1;
  max-width: 120px;
  height: 4px;
  background: repeating-linear-gradient(
    90deg,
    ${theme.colors.primary.main} 0 4px,
    transparent 4px 8px
  );
`;

const StatsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

// Individual stat card styled like an energy tank window
const StatCard = styled(motion.div, {
  shouldForwardProp: (prop) => prop !== 'tone',
})<{ tone: string }>`
  ${pixelFrame('muted')}
  box-shadow: ${pixelFrameShadow(theme.colors.secondary.medium)}, 6px 6px 0 0 ${theme.colors.neutral.black};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${theme.spacing.lg};
  position: relative;

  /* Tiny corner block in the stat color */
  &::before {
    content: '';
    position: absolute;
    top: 6px;
    left: 6px;
    width: 6px;
    height: 6px;
    background: ${props => props.tone};
  }
`;

// Reserves two lines so the bars line up when a label wraps
const StatLabel = styled.div`
  font-family: ${theme.typography.fonts.pixel};
  font-size: 14px;
  line-height: 1.4;
  min-height: 2.8em;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.neutral.silver};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: ${theme.spacing.sm};
  text-align: center;
`;

const EnergyBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

// Vertical HP track: cells stack bottom-up
const Track = styled.div`
  display: flex;
  flex-direction: column-reverse;
  gap: 2px;
  padding: 2px;
  background: ${theme.colors.neutral.black};
`;

const Cell = styled.span<{ filled: boolean; tone: string }>`
  display: block;
  width: 24px;
  height: 10px;
  ${props => segmentCell(props.filled, props.tone)}
`;

const StatValue = styled.div`
  font-family: ${theme.typography.fonts.heading};
  font-size: ${theme.typography.sizes['2xl']};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.neutral.white};
  margin-top: ${theme.spacing.sm};
  text-shadow: 2px 2px 0 ${theme.colors.primary.deep};
`;

// 12x14 pixel E-Tank drawn at 2x: outline, cap, body, shading, shine and the "E"
const ETank: React.FC<{ tone: string }> = ({ tone }) => {
  const ink = theme.colors.neutral.black;
  return (
    <svg
      width="24"
      height="28"
      viewBox="0 0 12 14"
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3" y="0" width="6" height="4" fill={ink} />
      <rect x="4" y="1" width="4" height="2" fill={tone} />
      <rect x="4" y="1" width="4" height="2" fill={ink} fillOpacity="0.35" />
      <rect x="0" y="3" width="12" height="11" fill={ink} />
      <rect x="1" y="4" width="10" height="9" fill={tone} />
      <rect x="8" y="4" width="3" height="9" fill={ink} fillOpacity="0.3" />
      <rect x="1" y="12" width="10" height="1" fill={ink} fillOpacity="0.3" />
      <rect x="2" y="5" width="1" height="4" fill={theme.colors.neutral.white} fillOpacity="0.7" />
      <rect x="3" y="5" width="1" height="1" fill={theme.colors.neutral.white} fillOpacity="0.7" />
      <path d="M5 6h3v1H6v1h2v1H6v1h2v1H5z" fill={ink} />
    </svg>
  );
};

// Fills one cell at a time once the bar scrolls into view; reduced motion shows it filled
const EnergyBar: React.FC<{ target: number; tone: string; delay: number }> = ({
  target,
  tone,
  delay,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const [lit, setLit] = useState(0);

  useEffect(() => {
    if (!inView || reduced) return;
    let count = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      count += 1;
      setLit(count);
      if (count < target) timer = setTimeout(tick, FILL_STEP_MS);
    };
    timer = setTimeout(tick, delay);
    return () => clearTimeout(timer);
  }, [inView, reduced, target, delay]);

  const shown = reduced ? target : lit;

  return (
    <Track ref={ref} aria-hidden="true">
      {Array.from({ length: BAR_CELLS }, (_, i) => (
        <Cell key={i} filled={i < shown} tone={tone} />
      ))}
    </Track>
  );
};

const statKeys = ['experience', 'projects', 'companies', 'technologies'] as const;
const statValues = ['13+', '20+', '6', '20+'];
const statFills = [85, 90, 60, 95];
const statColors = [
  theme.colors.primary.main,
  theme.colors.accent.green,
  theme.colors.accent.pink,
  theme.colors.accent.gold,
];

export const HomePage: React.FC = () => {
  const { t } = useTranslation('home');
  const reduced = useReducedMotion();

  const stats = statKeys.map((key, i) => ({
    value: statValues[i],
    label: t(`stats.${key}`),
    cells: Math.round(statFills[i] / 10),
    color: statColors[i],
  }));

  return (
    <PageTransition>
      <HomeContainer>
        <HeroSection />

        <StatsHUD>
          <HUDHeader>
            <HUDLine />
            <HUDTitle>{t('stats.title')}</HUDTitle>
            <HUDLine />
          </HUDHeader>

          <StatsContainer>
            {stats.map((stat, index) => (
              <StatCard
                key={statKeys[index]}
                tone={stat.color}
                initial={reduced ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.3, ease: steps4 }}
              >
                <StatLabel>{stat.label}</StatLabel>

                <EnergyBarContainer>
                  <ETank tone={stat.color} />
                  <EnergyBar
                    target={stat.cells}
                    tone={stat.color}
                    delay={index * 150 + 300}
                  />
                </EnergyBarContainer>

                <StatValue>{stat.value}</StatValue>
              </StatCard>
            ))}
          </StatsContainer>
        </StatsHUD>
      </HomeContainer>
    </PageTransition>
  );
};

export default HomePage;
