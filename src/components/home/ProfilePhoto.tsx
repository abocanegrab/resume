import { useState } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '../../styles/theme';
import { helmetReveal, photoOverlay, pulseGlow } from '../../styles/animations';

interface ProfilePhotoProps {
  imageSrc: string;
  altText?: string;
}

const PhotoContainer = styled(motion.div)`
  position: relative;
  width: 320px;
  height: 320px;
  cursor: pointer;

  @media (max-width: ${theme.breakpoints.laptop}) {
    width: 260px;
    height: 260px;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 220px;
    height: 220px;
  }
`;

const PhotoFrame = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid ${theme.colors.primary.main};
  box-shadow: ${theme.shadows.glow.cyan};

  /* Outer rings */
  &::before {
    content: '';
    position: absolute;
    top: -15px;
    left: -15px;
    right: -15px;
    bottom: -15px;
    border: 2px solid ${theme.colors.primary.dark};
    border-radius: 50%;
    opacity: 0.5;
  }

  &::after {
    content: '';
    position: absolute;
    top: -25px;
    left: -25px;
    right: -25px;
    bottom: -25px;
    border: 1px solid ${theme.colors.primary.dark};
    border-radius: 50%;
    opacity: 0.3;
  }
`;

const PhotoImage = styled(motion.img)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: filter ${theme.transitions.normal};
`;

const PlaceholderPhoto = styled(motion.div)`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg,
    ${theme.colors.secondary.dark} 0%,
    ${theme.colors.secondary.main} 50%,
    ${theme.colors.secondary.dark} 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    font-family: ${theme.typography.fonts.heading};
    font-size: ${theme.typography.sizes['5xl']};
    color: ${theme.colors.primary.main};
    opacity: 0.8;
  }
`;

const HelmetOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 5%;
  pointer-events: none;
`;

const HelmetSVG = styled(motion.svg)`
  width: 85%;
  height: auto;
  filter: drop-shadow(0 0 20px ${theme.colors.primary.glow});
`;

const GlowEffect = styled(motion.div)`
  position: absolute;
  top: -10%;
  left: -10%;
  width: 120%;
  height: 120%;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    ${theme.colors.primary.glow} 0%,
    transparent 70%
  );
  pointer-events: none;
  opacity: 0;
`;

const StatusBadge = styled(motion.div)`
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 24px;
  height: 24px;
  background: ${theme.colors.accent.green};
  border-radius: 50%;
  border: 3px solid ${theme.colors.background.primary};
  box-shadow: 0 0 10px ${theme.colors.accent.green};

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    height: 8px;
    background: white;
    border-radius: 50%;
    opacity: 0.8;
  }
`;

const HintText = styled(motion.span)`
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  font-family: ${theme.typography.fonts.mono};
  font-size: ${theme.typography.sizes.xs};
  color: ${theme.colors.neutral.lightGray};
  white-space: nowrap;
`;

export const ProfilePhoto: React.FC<ProfilePhotoProps> = ({
  imageSrc,
  altText = 'Profile Photo',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <PhotoContainer
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      variants={pulseGlow}
      initial="initial"
      animate="animate"
    >
      <PhotoFrame>
        {!imageError ? (
          <PhotoImage
            src={imageSrc}
            alt={altText}
            variants={photoOverlay}
            initial="initial"
            animate={isHovered ? 'hover' : 'initial'}
            onError={() => setImageError(true)}
          />
        ) : (
          <PlaceholderPhoto
            variants={photoOverlay}
            initial="initial"
            animate={isHovered ? 'hover' : 'initial'}
          >
            <span>X</span>
          </PlaceholderPhoto>
        )}

        <AnimatePresence>
          {isHovered && (
            <>
              <GlowEffect
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
              <HelmetOverlay>
                <HelmetSVG
                  viewBox="0 0 200 180"
                  variants={helmetReveal}
                  initial="initial"
                  animate="hover"
                  exit="initial"
                >
                  {/* Megaman X Style Helmet SVG */}
                  {/* Main helmet shape */}
                  <defs>
                    <linearGradient id="helmetGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor={theme.colors.primary.light} />
                      <stop offset="50%" stopColor={theme.colors.primary.main} />
                      <stop offset="100%" stopColor={theme.colors.primary.dark} />
                    </linearGradient>
                    <linearGradient id="gemGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="30%" stopColor={theme.colors.accent.green} />
                      <stop offset="100%" stopColor="#00AA00" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Helmet base */}
                  <path
                    d="M100 15
                       C140 15 170 40 175 80
                       C178 100 175 130 165 150
                       C155 170 130 180 100 180
                       C70 180 45 170 35 150
                       C25 130 22 100 25 80
                       C30 40 60 15 100 15Z"
                    fill="url(#helmetGradient)"
                    stroke={theme.colors.primary.light}
                    strokeWidth="2"
                  />

                  {/* Helmet ear guards */}
                  <path
                    d="M25 90
                       C15 90 10 100 10 115
                       C10 130 15 140 25 145
                       L30 140
                       C22 135 20 125 20 115
                       C20 105 22 95 30 92Z"
                    fill="url(#helmetGradient)"
                    stroke={theme.colors.primary.light}
                    strokeWidth="1"
                  />
                  <path
                    d="M175 90
                       C185 90 190 100 190 115
                       C190 130 185 140 175 145
                       L170 140
                       C178 135 180 125 180 115
                       C180 105 178 95 170 92Z"
                    fill="url(#helmetGradient)"
                    stroke={theme.colors.primary.light}
                    strokeWidth="1"
                  />

                  {/* Central crest */}
                  <path
                    d="M100 5
                       L115 25
                       L115 50
                       L100 60
                       L85 50
                       L85 25Z"
                    fill={theme.colors.primary.dark}
                    stroke={theme.colors.primary.main}
                    strokeWidth="2"
                  />

                  {/* Forehead gem */}
                  <ellipse
                    cx="100"
                    cy="55"
                    rx="12"
                    ry="15"
                    fill="url(#gemGradient)"
                    filter="url(#glow)"
                  />

                  {/* Gem shine */}
                  <ellipse
                    cx="96"
                    cy="50"
                    rx="4"
                    ry="5"
                    fill="white"
                    opacity="0.7"
                  />

                  {/* Visor line */}
                  <path
                    d="M40 100
                       C50 95 75 90 100 90
                       C125 90 150 95 160 100"
                    fill="none"
                    stroke={theme.colors.neutral.black}
                    strokeWidth="3"
                    opacity="0.5"
                  />

                  {/* Side details */}
                  <rect
                    x="30"
                    y="105"
                    width="15"
                    height="8"
                    rx="2"
                    fill={theme.colors.primary.light}
                    opacity="0.8"
                  />
                  <rect
                    x="155"
                    y="105"
                    width="15"
                    height="8"
                    rx="2"
                    fill={theme.colors.primary.light}
                    opacity="0.8"
                  />

                  {/* Animated gem glow */}
                  <motion.ellipse
                    cx="100"
                    cy="55"
                    rx="15"
                    ry="18"
                    fill="none"
                    stroke={theme.colors.accent.green}
                    strokeWidth="2"
                    initial={{ opacity: 0.3, scale: 1 }}
                    animate={{
                      opacity: [0.3, 0.8, 0.3],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                </HelmetSVG>
              </HelmetOverlay>
            </>
          )}
        </AnimatePresence>
      </PhotoFrame>

      <StatusBadge
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <HintText
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0 : 0.5 }}
        transition={{ delay: 2 }}
      >
        [ HOVER FOR X-HUNTER MODE ]
      </HintText>
    </PhotoContainer>
  );
};

export default ProfilePhoto;
