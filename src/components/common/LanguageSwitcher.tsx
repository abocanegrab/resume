import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { pixelOutline } from '../../styles/pixel';

const SwitcherButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px;
  background: ${theme.colors.secondary.dark};
  border: none;
  border-radius: 0;
  box-shadow: ${pixelOutline(theme.colors.secondary.medium)};
  cursor: pointer;
  font-family: ${theme.typography.fonts.pixel};
  font-size: 12px;
  line-height: 1;
  letter-spacing: 0.1em;
  color: ${theme.colors.neutral.silver};

  &:hover,
  &:focus-visible {
    box-shadow: ${pixelOutline(theme.colors.primary.main)};
    outline: none;
  }

  &:active {
    transform: translate(1px, 1px);
  }
`;

const LangOption = styled('span', {
  shouldForwardProp: prop => prop !== 'isActive',
})<{ isActive: boolean }>`
  padding: 4px 6px;
  background: ${props => props.isActive ? theme.colors.primary.deep : 'transparent'};
  color: ${props => props.isActive ? theme.colors.neutral.white : theme.colors.neutral.lightGray};
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
      aria-label="Toggle language"
    >
      <LangOption isActive={isEnglish}>EN</LangOption>
      <Divider aria-hidden="true">/</Divider>
      <LangOption isActive={!isEnglish}>ES</LangOption>
    </SwitcherButton>
  );
};

export default LanguageSwitcher;
