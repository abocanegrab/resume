import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HeroSection } from '../components/home/HeroSection';
import { PageTransition } from '../components/common/PageTransition';
import { theme } from '../styles/theme';

const HomeContainer = styled.div`
  width: 100%;
`;

// Stats section styled like Megaman HUD
const StatsHUD = styled(motion.section)`
  padding: ${theme.spacing['3xl']} ${theme.spacing.lg};
  background: linear-gradient(
    180deg,
    ${theme.colors.background.secondary} 0%,
    ${theme.colors.secondary.dark} 100%
  );
  border-top: 3px solid ${theme.colors.primary.main};
  position: relative;
  overflow: hidden;

  /* Scanline effect */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${theme.colors.gradients.scanline};
    pointer-events: none;
    opacity: 0.5;
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
  font-size: 12px;
  color: ${theme.colors.primary.main};
  text-transform: uppercase;
  letter-spacing: 0.2em;
  text-shadow: 0 0 10px ${theme.colors.primary.main}60;
`;

const HUDLine = styled.div`
  flex: 1;
  max-width: 100px;
  height: 2px;
  background: linear-gradient(
    90deg,
    ${theme.colors.primary.main} 0%,
    transparent 100%
  );

  &:last-child {
    background: linear-gradient(
      90deg,
      transparent 0%,
      ${theme.colors.primary.main} 100%
    );
  }
`;

const StatsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
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

// Individual stat card styled like energy tank / HP bar
const StatCard = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${theme.spacing.lg};
  background: ${theme.colors.background.card};
  border: 2px solid ${theme.colors.secondary.medium};
  border-radius: ${theme.borderRadius.md};
  position: relative;

  /* Corner accents */
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    border: 2px solid ${theme.colors.primary.main};
  }

  &::before {
    top: -2px;
    left: -2px;
    border-right: none;
    border-bottom: none;
  }

  &::after {
    bottom: -2px;
    right: -2px;
    border-left: none;
    border-top: none;
  }
`;

const StatLabel = styled.div`
  font-family: ${theme.typography.fonts.pixel};
  font-size: 8px;
  color: ${theme.colors.neutral.silver};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: ${theme.spacing.md};
  text-align: center;
`;

// Energy bar container (vertical like Megaman HP)
const EnergyBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const EnergyBarWrapper = styled.div`
  width: 32px;
  height: 120px;
  background: ${theme.colors.neutral.darkGray};
  border: 2px solid ${theme.colors.secondary.light};
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column-reverse;

  /* Inner shadow */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.5);
    pointer-events: none;
    z-index: 2;
  }
`;

const EnergyBarFill = styled(motion.div)<{ barColor: string }>`
  width: 100%;
  background: linear-gradient(
    180deg,
    ${props => props.barColor} 0%,
    ${props => adjustColor(props.barColor, -30)} 100%
  );
  position: relative;
  border-radius: 2px;

  /* Shine effect */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 2px;
    width: 6px;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.4) 0%,
      transparent 100%
    );
  }
`;

// Segments overlay for the energy bar
const EnergySegments = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  z-index: 1;
  pointer-events: none;
`;

const Segment = styled.div`
  flex: 1;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);

  &:last-child {
    border-bottom: none;
  }
`;

const StatValue = styled.div`
  font-family: ${theme.typography.fonts.heading};
  font-size: ${theme.typography.sizes['2xl']};
  font-weight: ${theme.typography.weights.bold};
  color: ${theme.colors.neutral.white};
  margin-top: ${theme.spacing.sm};
  text-shadow: 0 0 10px ${theme.colors.primary.main}40;
`;

// E-Tank icon for decoration
const ETankIcon = styled.div<{ color: string }>`
  width: 24px;
  height: 28px;
  background: linear-gradient(
    180deg,
    ${props => props.color} 0%,
    ${props => adjustColor(props.color, -40)} 100%
  );
  border: 2px solid ${props => adjustColor(props.color, -60)};
  border-radius: 4px 4px 8px 8px;
  position: relative;
  margin-bottom: ${theme.spacing.xs};

  /* Cap */
  &::before {
    content: '';
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 12px;
    height: 6px;
    background: ${props => adjustColor(props.color, -20)};
    border: 2px solid ${props => adjustColor(props.color, -60)};
    border-bottom: none;
    border-radius: 4px 4px 0 0;
  }

  /* Shine */
  &::after {
    content: '';
    position: absolute;
    top: 4px;
    left: 3px;
    width: 6px;
    height: 8px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
  }
`;

// Helper function
function adjustColor(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const num = parseInt(hex, 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

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

  const stats = statKeys.map((key, i) => ({
    value: statValues[i],
    label: t(`stats.${key}`),
    fill: statFills[i],
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
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
              >
                <StatLabel>{stat.label}</StatLabel>

                <EnergyBarContainer>
                  <ETankIcon color={stat.color} />

                  <EnergyBarWrapper>
                    <EnergySegments>
                      {Array.from({ length: 10 }).map((_, i) => (
                        <Segment key={i} />
                      ))}
                    </EnergySegments>

                    <EnergyBarFill
                      barColor={stat.color}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${stat.fill}%` }}
                      viewport={{ once: true }}
                      transition={{
                        delay: index * 0.15 + 0.3,
                        duration: 1,
                        ease: 'easeOut'
                      }}
                    />
                  </EnergyBarWrapper>
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
