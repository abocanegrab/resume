import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { theme } from '../styles/theme';
import { PasswordScreen } from '../components/secret/PasswordScreen';
import { RevealScreen } from '../components/secret/RevealScreen';
import { RunnerGame } from '../components/secret/RunnerGame';

type Screen = 'password' | 'reveal' | 'game';

const PageWrapper = styled.div`
  position: relative;
  min-height: 100vh;
  background: ${theme.colors.neutral.black};
  overflow: hidden;
`;

const ScanlineOverlay = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 100;
  background: ${theme.colors.gradients.scanline};
  opacity: 0.4;
`;

const BackLink = styled(Link)`
  position: fixed;
  top: ${theme.spacing.lg};
  left: ${theme.spacing.lg};
  font-family: ${theme.typography.fonts.pixel};
  font-size: 10px;
  color: ${theme.colors.neutral.silver};
  text-decoration: none;
  z-index: 200;
  transition: color ${theme.transitions.fast};
  opacity: 0.7;

  &:hover {
    color: ${theme.colors.primary.main};
    opacity: 1;
  }

  &::before {
    content: '< ';
  }
`;

export const SecretPage: React.FC = () => {
  const { t } = useTranslation('common');
  const [screen, setScreen] = useState<Screen>('password');

  return (
    <PageWrapper>
      <ScanlineOverlay />
      <BackLink to="/">{t('secret.back')}</BackLink>
      {screen === 'password' && (
        <PasswordScreen onSuccess={() => setScreen('reveal')} />
      )}
      {screen === 'reveal' && (
        <RevealScreen onComplete={() => setScreen('game')} />
      )}
      {screen === 'game' && (
        <RunnerGame />
      )}
    </PageWrapper>
  );
};

export default SecretPage;
