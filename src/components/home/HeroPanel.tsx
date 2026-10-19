import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { css, keyframes } from '@emotion/react';
import { useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { theme } from '../../styles/theme';
import { pixelCard, pixelOutline } from '../../styles/pixel';
import { SegmentBar } from '../common/SegmentBar';
import { visuallyHidden } from '../../styles/a11y';
import { skills } from '../../data/skills';
import { PixelMorphPhoto } from './PixelMorphPhoto';

const BAR_CELLS = 16;

// Four highest-level skills, shown as the "equipped" loadout
const TOP_SKILLS = [...skills].sort((a, b) => b.level - a.level).slice(0, 4);

const cursorBlink = keyframes`
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
`;

// Character-select panel: portrait, name, class, stats and the main menu
const Panel = styled.div`
  grid-area: panel;
  ${pixelCard('blue')}
  padding: ${theme.spacing.lg};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
  container-type: inline-size;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.md};
  }
`;

// Narrow panel (two-column grid near 1025px, small phones): portrait above the name
const Header = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing.md};

  @container (max-width: 400px) {
    flex-direction: column;
    gap: ${theme.spacing.sm};
  }
`;

// Leaves room for the portrait's 2px outline and sizes it (beats its own media queries)
const PortraitCell = styled.div`
  flex-shrink: 0;
  padding: 2px;

  & > div {
    width: 128px;
    height: 128px;
  }

  @container (max-width: 400px) {
    & > div {
      width: 96px;
      height: 96px;
    }
  }
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
  overflow-wrap: break-word;

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

const SrOnly = styled.span`
  ${visuallyHidden}
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

const StatBar: React.FC<{ label: string; filled: number; tone: string }> = ({
  label,
  filled,
  tone,
}) => (
  <StatRow>
    <StatLabel>{label}</StatLabel>
    <SegmentBar cells={BAR_CELLS} filled={filled} tone={tone} />
    <StatValue>
      {filled}/{BAR_CELLS}
    </StatValue>
  </StatRow>
);

// Loadout row: the whole row links to the skills page
const Equipped = styled(Link)`
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing.md};
  padding: 6px ${theme.spacing.sm};
  margin: 0 2px;
  text-decoration: none;

  &:hover,
  &:focus-visible {
    background: ${theme.colors.background.secondary};
    box-shadow: ${pixelOutline(theme.colors.primary.main)};
  }

  &:focus-visible {
    outline-offset: 4px;
  }

  @container (max-width: 400px) {
    flex-direction: column;
    gap: ${theme.spacing.sm};
  }
`;

const EquippedLabel = styled.span`
  font-family: ${theme.typography.fonts.pixel};
  font-size: 14px;
  line-height: 1.4;
  text-transform: uppercase;
  color: ${theme.colors.accent.gold};
  padding-top: 2px;
  white-space: nowrap;

  &::after {
    content: ' ▶';
    content: ' ▶' / '';
  }
`;

const Tags = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.sm} 12px;
  margin: 0;
  padding: 2px;
  list-style: none;
`;

const Tag = styled.li`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 8px;
  font-family: ${theme.typography.fonts.pixel};
  font-size: 14px;
  line-height: 1.4;
  text-transform: uppercase;
  color: ${theme.colors.neutral.white};
  background: ${theme.colors.neutral.black};
  box-shadow: ${pixelOutline(theme.colors.secondary.medium)};

  svg {
    flex-shrink: 0;
    width: 14px;
    height: 14px;
    color: ${theme.colors.primary.main};
  }
`;

const Menu = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  padding-top: 12px;
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
  padding: 6px 12px 6px 36px;
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

// Rotating class typewriter; keyed by language so it restarts on a language change
const RoleTicker: React.FC = () => {
  const [currentRole, setCurrentRole] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const reduced = useReducedMotion();
  const { t } = useTranslation('home');

  const roles = useMemo(() => t('hero.roles', { returnObjects: true }) as string[], [t]);

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

    // Fully typed: hold, then start deleting
    if (!isDeleting && displayedText === targetText) {
      const hold = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(hold);
    }

    const typeSpeed = isDeleting ? 50 : 100;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayedText(targetText.slice(0, displayedText.length + 1));
      } else if (displayedText.length > 0) {
        setDisplayedText(displayedText.slice(0, -1));
      } else {
        setIsDeleting(false);
        setCurrentRole((prev) => (prev + 1) % roles.length);
      }
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, currentRole, roles, reduced]);

  return (
    <RoleText>
      <SrOnly>{roles[currentRole]}</SrOnly>
      <span aria-hidden="true">
        {displayedText}
        <TypeCursor />
      </span>
    </RoleText>
  );
};

// Set to `${import.meta.env.BASE_URL}images/profile/developer-photo.png` once the photo is added
const PROFILE_PHOTO: string | undefined = undefined;

export const HeroPanel: React.FC = () => {
  const { t, i18n } = useTranslation('home');
  const { t: tc } = useTranslation('common');

  return (
    <Panel>
      <Header>
        <PortraitCell>
          <PixelMorphPhoto
            photoSrc={PROFILE_PHOTO}
            pixelSrc={`${import.meta.env.BASE_URL}images/profile/pixel-portrait.svg`}
            alt={t('hero.photoAlt')}
            showHint={false}
          />
        </PortraitCell>

        <Identity>
          <SpeakerName>{t('hero.name')}</SpeakerName>
          <RoleLabel>{t('hero.classLabel')}</RoleLabel>
          <RoleTicker key={i18n.resolvedLanguage} />
        </Identity>
      </Header>

      <Stats aria-hidden="true">
        <StatBar label={t('hero.hud.energy')} filled={16} tone={theme.colors.primary.main} />
        <StatBar label={t('hero.hud.exp')} filled={14} tone={theme.colors.accent.green} />
      </Stats>

      <Equipped to="/skills">
        <EquippedLabel>{t('hero.equipped')}</EquippedLabel>
        <Tags>
          {TOP_SKILLS.map(({ name, icon: Icon }) => (
            <Tag key={name}>
              <Icon aria-hidden="true" />
              {name}
            </Tag>
          ))}
        </Tags>
        <SrOnly>{t('hero.equippedLink')}</SrOnly>
      </Equipped>

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
