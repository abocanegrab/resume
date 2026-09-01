import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { theme } from '../../styles/theme';
import { PixelMorphPhoto } from './PixelMorphPhoto';

const Box = styled(motion.section)`
  position: relative;
  z-index: 2;
  max-width: 1100px;
  margin: -${theme.spacing['2xl']} auto 0;
  padding: ${theme.spacing.xl};
  background: linear-gradient(
    135deg,
    ${theme.colors.background.secondary}f5 0%,
    ${theme.colors.secondary.dark}fa 100%
  );
  border: 3px solid ${theme.colors.primary.main};
  border-radius: ${theme.borderRadius.sm};
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5), 0 0 24px ${theme.colors.primary.main}22;
  display: grid;
  grid-template-columns: 170px 1fr;
  gap: ${theme.spacing.xl};
  align-items: start;

  /* Dialog corner accents */
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 18px;
    height: 18px;
    border: 3px solid ${theme.colors.accent.green};
  }

  &::before {
    top: -3px;
    left: -3px;
    border-right: none;
    border-bottom: none;
  }

  &::after {
    bottom: -3px;
    right: -3px;
    border-left: none;
    border-top: none;
  }

  @media (max-width: ${theme.breakpoints.laptop}) {
    margin-left: ${theme.spacing.lg};
    margin-right: ${theme.spacing.lg};
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
    padding: ${theme.spacing.lg};
  }
`;

const PortraitCell = styled.div`
  display: flex;
  justify-content: center;
`;

const ContentCell = styled.div`
  min-width: 0;
`;

const SpeakerName = styled.h1`
  font-size: ${theme.typography.sizes['2xl']};
  color: ${theme.colors.neutral.white};
  margin-bottom: ${theme.spacing.xs};
  text-shadow:
    0 0 10px ${theme.colors.primary.main}40,
    2px 2px 0 ${theme.colors.secondary.dark};

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: ${theme.typography.sizes.xl};
  }
`;

const RoleLine = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.md};
  padding-bottom: ${theme.spacing.md};
  border-bottom: 2px solid ${theme.colors.secondary.medium};

  @media (max-width: ${theme.breakpoints.tablet}) {
    justify-content: center;
  }
`;

const RoleLabel = styled.span`
  font-family: ${theme.typography.fonts.pixel};
  font-size: 12px;
  color: ${theme.colors.accent.green};
  text-transform: uppercase;
`;

const RoleText = styled.span`
  font-family: ${theme.typography.fonts.heading};
  font-size: ${theme.typography.sizes.lg};
  color: ${theme.colors.primary.main};
  text-shadow: 0 0 15px ${theme.colors.primary.main}60;
  min-height: 1.4em;
`;

const TypeCursor = styled.span`
  display: inline-block;
  width: 3px;
  height: 1em;
  background: ${theme.colors.primary.main};
  margin-left: 2px;
  vertical-align: middle;
  animation: blink 0.8s step-end infinite;

  @keyframes blink {
    50% { opacity: 0; }
  }
`;

const Description = styled.p`
  font-family: ${theme.typography.fonts.mono};
  font-size: ${theme.typography.sizes.base};
  color: ${theme.colors.neutral.silver};
  line-height: ${theme.typography.lineHeights.relaxed};
  min-height: 5.25em;
  margin-bottom: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.tablet}) {
    min-height: 0;
  }
`;

const Advance = styled.span<{ visible: boolean }>`
  display: inline-block;
  margin-left: ${theme.spacing.sm};
  color: ${theme.colors.primary.main};
  opacity: ${props => (props.visible ? 1 : 0)};
  animation: ${props => (props.visible ? 'advanceBlink 0.9s step-end infinite' : 'none')};

  @keyframes advanceBlink {
    50% { opacity: 0; }
  }
`;

const Options = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.sm} ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: center;
    gap: ${theme.spacing.sm};
  }
`;

const optionStyles = `
  position: relative;
  font-family: ${theme.typography.fonts.heading};
  font-size: ${theme.typography.sizes.base};
  font-weight: ${theme.typography.weights.semibold};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${theme.colors.neutral.white};
  text-decoration: none;
  padding: ${theme.spacing.sm} 0 ${theme.spacing.sm} 22px;
  white-space: nowrap;
  transition: color ${theme.transitions.fast};

  &::before {
    content: '▶';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    font-family: ${theme.typography.fonts.pixel};
    font-size: 12px;
    color: ${theme.colors.primary.main};
    opacity: 0;
    transition: opacity ${theme.transitions.fast};
  }

  &:hover,
  &:focus-visible {
    color: ${theme.colors.primary.main};

    &::before {
      opacity: 1;
      animation: optionBlink 0.6s step-end infinite;
    }
  }

  @keyframes optionBlink {
    50% { opacity: 0.2; }
  }
`;

const OptionLink = styled(Link)`
  ${optionStyles}
`;

const OptionAnchor = styled.a`
  ${optionStyles}
`;

// Types the dialog text once; remount (key change) restarts it
const Typewriter: React.FC<{ text: string; skip: boolean }> = ({ text, skip }) => {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduced || skip || count >= text.length) return;
    const t = setTimeout(() => setCount(c => c + 1), 16);
    return () => clearTimeout(t);
  }, [count, text, reduced, skip]);

  const shown = reduced || skip ? text : text.slice(0, count);
  const done = shown.length >= text.length;

  return (
    <Description aria-label={text}>
      <span aria-hidden="true">{shown}</span>
      <Advance aria-hidden="true" visible={done}>▼</Advance>
    </Description>
  );
};

export const DialogBox: React.FC = () => {
  const [currentRole, setCurrentRole] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [skipTyping, setSkipTyping] = useState(false);
  const reduced = useReducedMotion();
  const { t, i18n } = useTranslation('home');
  const { t: tc } = useTranslation('common');

  const roles = t('hero.roles', { returnObjects: true }) as string[];
  const description = t('hero.description');

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
    <Box
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      onClick={() => setSkipTyping(true)}
    >
      <PortraitCell>
        <PixelMorphPhoto
          photoSrc={`${import.meta.env.BASE_URL}images/profile/developer-photo.png`}
          pixelSrc={`${import.meta.env.BASE_URL}images/profile/pixel-portrait.svg`}
          alt={t('hero.photoAlt')}
          size={160}
          showHint={false}
        />
      </PortraitCell>

      <ContentCell>
        <SpeakerName>{t('hero.name')}</SpeakerName>

        <RoleLine>
          <RoleLabel>{t('hero.classLabel')}</RoleLabel>
          <RoleText aria-label={roles[currentRole]}>
            <span aria-hidden="true">
              {displayedText}<TypeCursor />
            </span>
          </RoleText>
        </RoleLine>

        <Typewriter key={`${i18n.resolvedLanguage}-desc`} text={description} skip={skipTyping} />

        <Options aria-label={t('hero.playerData')}>
          <OptionLink to="/projects">{tc('buttons.viewProjects')}</OptionLink>
          <OptionAnchor href={`${import.meta.env.BASE_URL}AaronBocanegra_Resume.pdf`} download>
            {tc('buttons.downloadCV')}
          </OptionAnchor>
          <OptionLink to="/contact">{tc('buttons.contactHQ')}</OptionLink>
        </Options>
      </ContentCell>
    </Box>
  );
};

export default DialogBox;
