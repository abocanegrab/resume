import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { css, keyframes } from '@emotion/react';
import { useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { theme } from '../../styles/theme';
import { pixelFrame, pixelFrameShadow, pixelOutline, segmentCell } from '../../styles/pixel';
import { PixelMorphPhoto } from './PixelMorphPhoto';

const BAR_CELLS = 16;

const cursorBlink = keyframes`
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
`;

// Character-select panel: portrait, name, class, stats and the main menu
const Panel = styled.div`
  grid-area: panel;
  ${pixelFrame('blue')}
  box-shadow: ${pixelFrameShadow(theme.colors.primary.main)}, 6px 6px 0 0 ${theme.colors.neutral.black};
  padding: ${theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  min-width: 0;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.md};
  }
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing.md};
`;

// Leaves room for the portrait's 2px outline
const PortraitCell = styled.div`
  flex-shrink: 0;
  padding: 2px;
`;

const Identity = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const SpeakerName = styled.h1`
  font-family: ${theme.typography.fonts.heading};
  font-size: ${theme.typography.sizes.xl};
  line-height: ${theme.typography.lineHeights.snug};
  color: ${theme.colors.neutral.white};
  margin: 0 0 ${theme.spacing.xs};
  text-shadow: 2px 2px 0 ${theme.colors.primary.deep};
  overflow-wrap: anywhere;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.typography.sizes.lg};
  }
`;

const RoleLabel = styled.span`
  font-family: ${theme.typography.fonts.pixel};
  font-size: 14px;
  line-height: 1.4;
  color: ${theme.colors.accent.green};
  text-transform: uppercase;
`;

// Reserves two lines so the rotating roles never shift the panel
const RoleText = styled.span`
  display: block;
  font-family: ${theme.typography.fonts.heading};
  font-size: ${theme.typography.sizes.base};
  font-weight: ${theme.typography.weights.semibold};
  line-height: ${theme.typography.lineHeights.snug};
  color: ${theme.colors.primary.main};
  min-height: calc(2 * 1.25em);
`;

const TypeCursor = styled.span`
  display: inline-block;
  width: 3px;
  height: 1em;
  background: ${theme.colors.primary.main};
  margin-left: 2px;
  vertical-align: middle;
  animation: ${cursorBlink} 0.8s step-end infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Stats = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const StatRow = styled.div`
  display: grid;
  grid-template-columns: 3.5em minmax(0, 1fr) 4.5em;
  align-items: center;
  gap: ${theme.spacing.sm};
  font-family: ${theme.typography.fonts.pixel};
  font-size: 14px;
  line-height: 1.4;
`;

const StatLabel = styled.span`
  color: ${theme.colors.neutral.white};
`;

const StatValue = styled.span`
  color: ${theme.colors.neutral.lightGray};
  text-align: right;
`;

const Track = styled.div`
  display: grid;
  grid-template-columns: repeat(${BAR_CELLS}, minmax(0, 1fr));
  gap: 2px;
  padding: 2px;
  background: ${theme.colors.neutral.black};
`;

const Cell = styled.span<{ filled: boolean; tone: string }>`
  height: 10px;
  ${props => segmentCell(props.filled, props.tone)}
`;

const StatBar: React.FC<{ label: string; filled: number; tone: string }> = ({
  label,
  filled,
  tone,
}) => (
  <StatRow>
    <StatLabel>{label}</StatLabel>
    <Track aria-hidden="true">
      {Array.from({ length: BAR_CELLS }, (_, i) => (
        <Cell key={i} filled={i < filled} tone={tone} />
      ))}
    </Track>
    <StatValue>
      {filled}/{BAR_CELLS}
    </StatValue>
  </StatRow>
);

const Menu = styled.nav`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  padding-top: ${theme.spacing.md};
  border-top: 2px solid ${theme.colors.secondary.medium};
`;

// Game-menu row: the ▶ cursor appears (blinking) on the hovered/focused option
const optionStyles = css`
  position: relative;
  display: block;
  font-family: ${theme.typography.fonts.pixel};
  font-size: 16px;
  line-height: 1.4;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${theme.colors.neutral.white};
  text-decoration: none;
  padding: 8px 12px 8px 36px;
  margin: 0 2px;

  &::before {
    content: '▶';
    content: '▶' / '';
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
    line-height: 1;
    color: ${theme.colors.accent.gold};
    display: none;
  }

  &:hover,
  &:focus-visible {
    background: ${theme.colors.primary.deep};
    box-shadow: ${pixelOutline(theme.colors.primary.main)};
  }

  &:focus-visible {
    outline-offset: 4px;
  }

  &:hover::before,
  &:focus-visible::before {
    display: block;
    animation: ${cursorBlink} 0.8s step-end infinite;
  }

  &:active {
    transform: translate(2px, 2px);
  }

  @media (prefers-reduced-motion: reduce) {
    &:hover::before,
    &:focus-visible::before {
      animation: none;
    }
  }
`;

const OptionLink = styled(Link)`
  ${optionStyles}
`;

const OptionAnchor = styled.a`
  ${optionStyles}
`;

export const HeroPanel: React.FC = () => {
  const [currentRole, setCurrentRole] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const reduced = useReducedMotion();
  const { t } = useTranslation('home');
  const { t: tc } = useTranslation('common');

  const roles = t('hero.roles', { returnObjects: true }) as string[];

  useEffect(() => {
    const targetText = roles[currentRole];

    if (reduced) {
      // No typewriter: show the full role, rotate slowly
      const timeout = setTimeout(() => {
        if (displayedText !== targetText) {
          setDisplayedText(targetText);
        } else {
          setCurrentRole((prev) => (prev + 1) % roles.length);
        }
      }, displayedText === targetText ? 5000 : 0);
      return () => clearTimeout(timeout);
    }

    const typeSpeed = isDeleting ? 50 : 100;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayedText.length < targetText.length) {
          setDisplayedText(targetText.slice(0, displayedText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayedText.length > 0) {
          setDisplayedText(displayedText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentRole((prev) => (prev + 1) % roles.length);
        }
      }
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, currentRole, roles, reduced]);

  return (
    <Panel>
      <Header>
        <PortraitCell>
          <PixelMorphPhoto
            photoSrc={`${import.meta.env.BASE_URL}images/profile/developer-photo.png`}
            pixelSrc={`${import.meta.env.BASE_URL}images/profile/pixel-portrait.svg`}
            alt={t('hero.photoAlt')}
            size={128}
            showHint={false}
          />
        </PortraitCell>

        <Identity>
          <SpeakerName>{t('hero.name')}</SpeakerName>
          <RoleLabel>{t('hero.classLabel')}</RoleLabel>
          <RoleText aria-label={roles[currentRole]}>
            <span aria-hidden="true">
              {displayedText}
              <TypeCursor />
            </span>
          </RoleText>
        </Identity>
      </Header>

      <Stats>
        <StatBar label={t('hero.hud.energy')} filled={16} tone={theme.colors.primary.main} />
        <StatBar label={t('hero.hud.exp')} filled={14} tone={theme.colors.accent.green} />
      </Stats>

      <Menu aria-label={t('hero.playerData')}>
        <OptionLink to="/projects">{tc('buttons.viewProjects')}</OptionLink>
        <OptionAnchor href={`${import.meta.env.BASE_URL}AaronBocanegra_Resume.pdf`} download>
          {tc('buttons.downloadCV')}
        </OptionAnchor>
        <OptionLink to="/contact">{tc('buttons.contactHQ')}</OptionLink>
      </Menu>
    </Panel>
  );
};

export default HeroPanel;
