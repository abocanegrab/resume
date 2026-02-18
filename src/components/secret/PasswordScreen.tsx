import { useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { useTranslation } from 'react-i18next';
import { theme } from '../../styles/theme';

const SECRET_CODE = new Set([3, 6, 10, 13]);

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
`;

const flash = keyframes`
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${theme.spacing.lg};
`;

const Title = styled.h1`
  font-family: ${theme.typography.fonts.pixel};
  font-size: ${theme.typography.sizes.lg};
  color: ${theme.colors.primary.main};
  text-align: center;
  margin-bottom: ${theme.spacing['2xl']};
  text-shadow: 0 0 10px ${theme.colors.primary.glow};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.typography.sizes.sm};
  }
`;

const Grid = styled.div<{ shaking: boolean }>`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  margin-bottom: ${theme.spacing.xl};
  animation: ${({ shaking }) => (shaking ? shake : 'none')} 0.5s ease;
`;

const Cell = styled.button<{ active: boolean }>`
  width: 72px;
  height: 72px;
  border: 2px solid ${({ active }) => (active ? theme.colors.primary.main : theme.colors.secondary.main)};
  background: ${({ active }) =>
    active ? 'rgba(0, 212, 255, 0.2)' : theme.colors.secondary.dark};
  color: ${({ active }) => (active ? theme.colors.primary.main : theme.colors.neutral.lightGray)};
  font-family: ${theme.typography.fonts.pixel};
  font-size: ${theme.typography.sizes.xs};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  box-shadow: ${({ active }) => (active ? theme.shadows.glow.cyan : 'none')};
  position: relative;

  &:hover {
    border-color: ${theme.colors.primary.light};
    background: rgba(0, 212, 255, 0.1);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 60px;
    height: 60px;
    font-size: 10px;
  }
`;

const SubmitButton = styled.button`
  font-family: ${theme.typography.fonts.pixel};
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.neutral.black};
  background: ${theme.colors.primary.main};
  border: none;
  padding: ${theme.spacing.md} ${theme.spacing['2xl']};
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: all ${theme.transitions.fast};

  &:hover {
    background: ${theme.colors.primary.light};
    box-shadow: ${theme.shadows.glow.cyan};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.typography.sizes.xs};
    padding: ${theme.spacing.sm} ${theme.spacing.xl};
  }
`;

const DeniedText = styled.p<{ visible: boolean }>`
  font-family: ${theme.typography.fonts.pixel};
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.accent.red};
  margin-top: ${theme.spacing.lg};
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  text-shadow: 0 0 10px rgba(255, 51, 102, 0.5);
  animation: ${({ visible }) => (visible ? flash : 'none')} 0.3s ease;
  min-height: 1.5em;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.typography.sizes.xs};
  }
`;

const HintText = styled.p`
  font-family: ${theme.typography.fonts.pixel};
  font-size: 10px;
  color: ${theme.colors.neutral.lightGray};
  opacity: 0.4;
  margin-top: ${theme.spacing['2xl']};
  text-align: center;
  max-width: 300px;
  line-height: 1.8;
`;

const WhiteFlash = styled.div<{ active: boolean }>`
  position: fixed;
  inset: 0;
  background: white;
  z-index: 999;
  pointer-events: none;
  opacity: ${({ active }) => (active ? 1 : 0)};
  transition: opacity 0.4s ease;
`;

interface PasswordScreenProps {
  onSuccess: () => void;
}

export const PasswordScreen: React.FC<PasswordScreenProps> = ({ onSuccess }) => {
  const { t } = useTranslation('common');
  const [toggled, setToggled] = useState<Set<number>>(new Set());
  const [denied, setDenied] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [flashing, setFlashing] = useState(false);

  const toggleCell = useCallback((n: number) => {
    setDenied(false);
    setToggled((prev) => {
      const next = new Set(prev);
      if (next.has(n)) {
        next.delete(n);
      } else {
        next.add(n);
      }
      return next;
    });
  }, []);

  const handleSubmit = useCallback(() => {
    const isCorrect =
      toggled.size === SECRET_CODE.size &&
      [...toggled].every((v) => SECRET_CODE.has(v));

    if (isCorrect) {
      setFlashing(true);
      setTimeout(onSuccess, 500);
    } else {
      setDenied(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      setTimeout(() => setDenied(false), 2000);
    }
  }, [toggled, onSuccess]);

  return (
    <Wrapper>
      <WhiteFlash active={flashing} />
      <Title>{t('secret.password.title')}</Title>
      <Grid shaking={shaking}>
        {Array.from({ length: 16 }, (_, i) => {
          const n = i + 1;
          return (
            <Cell
              key={n}
              active={toggled.has(n)}
              onClick={() => toggleCell(n)}
              aria-label={`Cell ${n}`}
            >
              {n}
            </Cell>
          );
        })}
      </Grid>
      <SubmitButton onClick={handleSubmit}>
        {t('secret.password.submit')}
      </SubmitButton>
      <DeniedText visible={denied}>
        {denied ? t('secret.password.denied') : ''}
      </DeniedText>
      <HintText>{t('secret.password.hint')}</HintText>
    </Wrapper>
  );
};

export default PasswordScreen;
