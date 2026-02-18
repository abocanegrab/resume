import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { theme } from '../../styles/theme';

const SwitcherButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  background: transparent;
  border: 1px solid ${theme.colors.secondary.medium};
  border-radius: ${theme.borderRadius.sm};
  cursor: pointer;
  font-family: ${theme.typography.fonts.pixel};
  font-size: 10px;
  letter-spacing: 0.1em;
  color: ${theme.colors.neutral.silver};
  transition: all ${theme.transitions.fast};

  &:hover {
    border-color: ${theme.colors.primary.main};
    color: ${theme.colors.primary.main};
  }
`;

const LangOption = styled.span<{ isActive: boolean }>`
  color: ${props => props.isActive ? theme.colors.primary.main : theme.colors.neutral.lightGray};
  font-weight: ${props => props.isActive ? 'bold' : 'normal'};
`;

const Divider = styled.span`
  color: ${theme.colors.secondary.medium};
`;

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('es') ? 'en' : 'es';
    i18n.changeLanguage(newLang);
  };

  const isEnglish = !i18n.language.startsWith('es');

  return (
    <SwitcherButton
      onClick={toggleLanguage}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle language"
    >
      <LangOption isActive={isEnglish}>EN</LangOption>
      <Divider>/</Divider>
      <LangOption isActive={!isEnglish}>ES</LangOption>
    </SwitcherButton>
  );
};

export default LanguageSwitcher;
