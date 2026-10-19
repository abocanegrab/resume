import styled from '@emotion/styled';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { theme } from '../../styles/theme';
import { dither, pixelFrame, pixelFrameShadow } from '../../styles/pixel';
import { SegmentBar } from '../common/SegmentBar';
import { ETank } from './ETank';

const BAR_CELLS = 10;
const STAGGER_MS = 150;
const FILL_START_MS = 300;

// Discrete easing for Framer: jumps in 4 frames, no smooth interpolation
const steps4 = (t: number) => Math.floor(t * 4) / 4;

const stats = [
  { key: 'experience', value: '13+', cells: 9, color: theme.colors.primary.main },
  { key: 'projects', value: '20+', cells: 9, color: theme.colors.accent.green },
  { key: 'companies', value: '6', cells: 6, color: theme.colors.accent.pink },
  { key: 'technologies', value: '20+', cells: 10, color: theme.colors.accent.gold },
] as const;

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

// Mobile-first: 1 column, 2 from just above mobile, 4 from laptop
const StatsGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2px;
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.spacing.xl};

  @media (min-width: calc(${theme.breakpoints.mobile} + 1px)) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: ${theme.breakpoints.laptop}) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
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
  min-width: 0;
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
  max-width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.neutral.silver};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: ${theme.spacing.sm};
  text-align: center;
  overflow-wrap: break-word;
`;

const EnergyBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const StatValue = styled.div`
  font-family: ${theme.typography.fonts.heading};
  font-size: ${theme.typography.sizes['2xl']};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.neutral.white};
  margin-top: ${theme.spacing.sm};
  text-shadow: 2px 2px 0 ${theme.colors.primary.deep};
`;

export const CombatStats: React.FC = () => {
  const { t } = useTranslation('home');
  const reduced = useReducedMotion();

  return (
    <StatsHUD>
      <HUDHeader>
        <HUDLine />
        <HUDTitle>{t('stats.title')}</HUDTitle>
        <HUDLine />
      </HUDHeader>

      <StatsGrid>
        {stats.map((stat, index) => (
          <StatCard
            key={stat.key}
            tone={stat.color}
            initial={reduced ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (index * STAGGER_MS) / 1000, duration: 0.3, ease: steps4 }}
          >
            <StatLabel>{t(`stats.${stat.key}`)}</StatLabel>

            <EnergyBarContainer>
              <ETank tone={stat.color} />
              <SegmentBar
                cells={BAR_CELLS}
                filled={stat.cells}
                tone={stat.color}
                orientation="vertical"
                animateOnView
                startDelayMs={index * STAGGER_MS + FILL_START_MS}
              />
            </EnergyBarContainer>

            <StatValue>{stat.value}</StatValue>
          </StatCard>
        ))}
      </StatsGrid>
    </StatsHUD>
  );
};

export default CombatStats;
