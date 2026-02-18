import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { theme } from '../../styles/theme';
import {
  fadeInUp,
  staggerContainer,
  floating,
} from '../../styles/animations';
import { Button } from '../common/Button';
import { ProfilePhoto } from './ProfilePhoto';
import { FaArrowRight, FaDownload, FaEnvelope } from 'react-icons/fa';

const HeroWrapper = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing['5xl']} ${theme.spacing.lg};
  position: relative;
  overflow: hidden;
`;

const HeroBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${theme.colors.gradients.heroBackground};
  z-index: -2;
`;

const GridPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    linear-gradient(${theme.colors.secondary.main}20 1px, transparent 1px),
    linear-gradient(90deg, ${theme.colors.secondary.main}20 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.3;
  z-index: -1;
`;

const HeroContent = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing['3xl']};
  max-width: 1200px;
  width: 100%;

  @media (max-width: ${theme.breakpoints.laptop}) {
    flex-direction: column-reverse;
    text-align: center;
    gap: ${theme.spacing['2xl']};
  }
`;

// Megaman-style frame around the text content
const BossSelectFrame = styled(motion.div)`
  flex: 1;
  max-width: 650px;
  position: relative;
  padding: ${theme.spacing.xl};
  background: linear-gradient(
    135deg,
    ${theme.colors.background.secondary}ee 0%,
    ${theme.colors.secondary.dark}dd 100%
  );
  border: 3px solid ${theme.colors.primary.main};
  border-radius: ${theme.borderRadius.lg};

  /* Corner decorations */
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border: 3px solid ${theme.colors.accent.green};
  }

  &::before {
    top: -3px;
    left: -3px;
    border-right: none;
    border-bottom: none;
    border-top-left-radius: ${theme.borderRadius.lg};
  }

  &::after {
    bottom: -3px;
    right: -3px;
    border-left: none;
    border-top: none;
    border-bottom-right-radius: ${theme.borderRadius.lg};
  }

  @media (max-width: ${theme.breakpoints.laptop}) {
    max-width: 100%;
  }
`;

// Top bar like stage select
const FrameHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.lg};
  padding-bottom: ${theme.spacing.md};
  border-bottom: 2px solid ${theme.colors.secondary.medium};
`;

const DataLabel = styled.span`
  font-family: ${theme.typography.fonts.pixel};
  font-size: 10px;
  color: ${theme.colors.accent.green};
  text-transform: uppercase;
  letter-spacing: 0.15em;
`;

const ScanLine = styled(motion.div)`
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    ${theme.colors.primary.main} 50%,
    transparent 100%
  );
  margin-top: ${theme.spacing.xs};
`;

const PlayerTag = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  font-family: ${theme.typography.fonts.mono};
  font-size: ${theme.typography.sizes.xs};
  color: ${theme.colors.primary.main};

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    background: ${theme.colors.accent.green};
    border-radius: 50%;
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; box-shadow: 0 0 5px ${theme.colors.accent.green}; }
    50% { opacity: 0.5; box-shadow: 0 0 10px ${theme.colors.accent.green}; }
  }
`;

const HeroTitle = styled(motion.h1)`
  font-size: ${theme.typography.sizes['5xl']};
  font-weight: ${theme.typography.weights.extrabold};
  line-height: ${theme.typography.lineHeights.tight};
  margin-bottom: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: ${theme.typography.sizes['3xl']};
  }
`;

const NameText = styled.span`
  display: block;
  color: ${theme.colors.neutral.white};
  text-shadow:
    0 0 10px ${theme.colors.primary.main}40,
    2px 2px 0 ${theme.colors.secondary.dark};
`;

const RoleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.laptop}) {
    justify-content: center;
  }
`;

const RoleLabel = styled.span`
  font-family: ${theme.typography.fonts.pixel};
  font-size: 10px;
  color: ${theme.colors.neutral.silver};
  text-transform: uppercase;
`;

const RoleText = styled.div`
  font-family: ${theme.typography.fonts.heading};
  font-size: ${theme.typography.sizes.xl};
  color: ${theme.colors.primary.main};
  text-shadow: 0 0 15px ${theme.colors.primary.main}60;
  min-height: 1.5em;

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: ${theme.typography.sizes.lg};
  }
`;

const Cursor = styled.span`
  display: inline-block;
  width: 3px;
  height: 1.2em;
  background: ${theme.colors.primary.main};
  margin-left: 2px;
  vertical-align: middle;
  animation: blink 0.8s step-end infinite;

  @keyframes blink {
    50% { opacity: 0; }
  }
`;

const HeroDescription = styled(motion.p)`
  font-size: ${theme.typography.sizes.md};
  color: ${theme.colors.neutral.silver};
  line-height: ${theme.typography.lineHeights.relaxed};
  margin-bottom: ${theme.spacing.xl};
`;

const HeroButtons = styled(motion.div)`
  display: flex;
  gap: ${theme.spacing.md};
  flex-wrap: wrap;

  @media (max-width: ${theme.breakpoints.laptop}) {
    justify-content: center;
  }
`;

// Character display area
const CharacterDisplay = styled(motion.div)`
  flex-shrink: 0;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing.lg};
`;

const CharacterFrame = styled.div`
  position: relative;
  padding: ${theme.spacing.md};
  background: ${theme.colors.background.secondary}99;
  border: 2px solid ${theme.colors.secondary.medium};
  border-radius: ${theme.borderRadius.md};

  /* Scan effect overlay */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      180deg,
      transparent 0%,
      ${theme.colors.primary.main}08 50%,
      transparent 100%
    );
    animation: scanMove 3s linear infinite;
    pointer-events: none;
  }

  @keyframes scanMove {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
  }
`;

const CharacterLabel = styled.div`
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: ${theme.colors.background.secondary};
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  border: 1px solid ${theme.colors.primary.main};
  border-radius: ${theme.borderRadius.sm};
  font-family: ${theme.typography.fonts.pixel};
  font-size: 8px;
  color: ${theme.colors.primary.main};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  white-space: nowrap;
`;

const StatusIndicator = styled(motion.div)`
  position: absolute;
  top: ${theme.spacing.sm};
  right: ${theme.spacing.sm};
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: ${theme.typography.fonts.pixel};
  font-size: 8px;
  color: ${theme.colors.accent.green};
`;

const StatusDot = styled.span`
  width: 6px;
  height: 6px;
  background: ${theme.colors.accent.green};
  border-radius: 50%;
  animation: statusBlink 1s infinite;

  @keyframes statusBlink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
`;

const ContactButton = styled(Link)`
  text-decoration: none;
`;

export const HeroSection: React.FC = () => {
  const [currentRole, setCurrentRole] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const { t } = useTranslation('home');
  const { t: tc } = useTranslation('common');

  const roles = t('hero.roles', { returnObjects: true }) as string[];

  useEffect(() => {
    const targetText = roles[currentRole];
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
  }, [displayedText, isDeleting, currentRole, roles]);

  return (
    <HeroWrapper>
      <HeroBackground />
      <GridPattern />

      <HeroContent
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <BossSelectFrame
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <FrameHeader>
            <div>
              <DataLabel>{t('hero.playerData')}</DataLabel>
              <ScanLine
                animate={{ scaleX: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <PlayerTag>{t('hero.ready')}</PlayerTag>
          </FrameHeader>

          <HeroTitle variants={fadeInUp}>
            <NameText>{t('hero.name')}</NameText>
          </HeroTitle>

          <RoleContainer>
            <RoleLabel>{t('hero.classLabel')}</RoleLabel>
            <RoleText>
              {displayedText}<Cursor />
            </RoleText>
          </RoleContainer>

          <HeroDescription variants={fadeInUp}>
            {t('hero.description')}
          </HeroDescription>

          <HeroButtons variants={fadeInUp}>
            <Link to="/projects">
              <Button variant="primary" size="lg">
                {tc('buttons.viewProjects')} <FaArrowRight />
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              {tc('buttons.downloadCV')} <FaDownload />
            </Button>
          </HeroButtons>
        </BossSelectFrame>

        <CharacterDisplay
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <CharacterFrame>
            <StatusIndicator>
              <StatusDot />
              {t('hero.online')}
            </StatusIndicator>
            <motion.div
              variants={floating}
              initial="initial"
              animate="animate"
            >
              <ProfilePhoto
                imageSrc="/images/profile/developer-photo.png"
                altText="Developer Profile"
              />
            </motion.div>
            <CharacterLabel>{t('hero.characterLabel')}</CharacterLabel>
          </CharacterFrame>

          <ContactButton to="/contact">
            <Button variant="secondary" size="sm">
              <FaEnvelope /> {tc('buttons.contactHQ')}
            </Button>
          </ContactButton>
        </CharacterDisplay>
      </HeroContent>
    </HeroWrapper>
  );
};

export default HeroSection;
