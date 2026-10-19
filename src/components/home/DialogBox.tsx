import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { theme } from '../../styles/theme';
import { pixelFrame, pixelFrameShadow } from '../../styles/pixel';
import { visuallyHidden } from '../../styles/a11y';

const advanceBlink = keyframes`
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
`;

// RPG dialog window: speaker tag on the left, typed line on the right
const Box = styled.section`
  grid-area: dialog;
  align-self: start;
  ${pixelFrame('sunset')}
  box-shadow: ${pixelFrameShadow(theme.colors.accent.gold)}, 6px 6px 0 0 ${theme.colors.neutral.black};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: ${theme.spacing.lg};
  align-items: start;
  cursor: pointer;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.sm};
  }
`;

const Speaker = styled.span`
  font-family: ${theme.typography.fonts.pixel};
  font-size: 14px;
  font-weight: ${theme.typography.weights.bold};
  line-height: ${theme.typography.lineHeights.relaxed};
  text-transform: uppercase;
  color: ${theme.colors.accent.gold};
  white-space: nowrap;
`;

const Description = styled.p`
  font-family: ${theme.typography.fonts.mono};
  font-size: ${theme.typography.sizes.base};
  color: ${theme.colors.neutral.silver};
  line-height: ${theme.typography.lineHeights.relaxed};
  margin: 0;
  display: grid;

  /* Typed text sits over an invisible full copy, so the box never grows while typing */
  & > span[aria-hidden] {
    grid-area: 1 / 1;
  }
`;

const SrOnly = styled.span`
  ${visuallyHidden}
`;

const Ghost = styled.span`
  visibility: hidden;
`;

const Advance = styled.span<{ visible: boolean }>`
  display: inline-block;
  margin-left: ${theme.spacing.sm};
  color: ${theme.colors.accent.gold};
  opacity: ${props => (props.visible ? 1 : 0)};
  animation: ${props => (props.visible ? advanceBlink : 'none')} 0.9s step-end infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
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
    <Description>
      <SrOnly>{text}</SrOnly>
      <Ghost aria-hidden="true">
        {text}
        <Advance visible={false}>▼</Advance>
      </Ghost>
      <span aria-hidden="true">
        {shown}
        <Advance visible={done}>▼</Advance>
      </span>
    </Description>
  );
};

export const DialogBox: React.FC = () => {
  const [skipTyping, setSkipTyping] = useState(false);
  const { t, i18n } = useTranslation('home');

  const firstName = t('hero.name').split(' ')[0];

  return (
    <Box onClick={() => setSkipTyping(true)}>
      <Speaker>{firstName}:</Speaker>
      <Typewriter key={`${i18n.resolvedLanguage}-desc`} text={t('hero.description')} skip={skipTyping} />
    </Box>
  );
};

export default DialogBox;
