import { useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { PageTransition } from '../components/common/PageTransition';
import { SectionTitle } from '../components/common/SectionTitle';
import { SkillBar } from '../components/skills/SkillBar';
import { CharacterSprite } from '../components/skills/CharacterSprite';
import { skills, skillCategories } from '../data/skills';
import type { Skill } from '../data/skills';
import { theme } from '../styles/theme';
import { dither, pixelCard, pixelOutline } from '../styles/pixel';

const SkillsContainer = styled.div`
  min-height: 100vh;
  padding: ${theme.spacing['5xl']} ${theme.spacing.lg};
  padding-top: calc(${theme.spacing['5xl']} + 80px);
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const TwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: ${theme.spacing['2xl']};
  align-items: start;

  @media (max-width: ${theme.breakpoints.laptop}) {
    grid-template-columns: 1fr;
  }
`;

const SkillsColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

// Equipment window. Sticky: keep it free of `filter` (the hard shadow is a box-shadow)
const SpriteColumn = styled.div`
  position: sticky;
  top: 120px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.lg};
  ${pixelCard('blue')}

  @media (max-width: ${theme.breakpoints.laptop}) {
    position: relative;
    top: 0;
    order: -1;
    margin-bottom: ${theme.spacing.xl};
  }
`;

const SpriteTitle = styled.h2`
  margin: 0;
  font-family: ${theme.typography.fonts.pixel};
  font-size: 16px;
  font-weight: ${theme.typography.weights.normal};
  line-height: 1.2;
  color: ${theme.colors.neutral.white};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: center;
`;

// Night-sky dither behind the sprite, inset like a viewport in the window
const SpriteStage = styled.div`
  ${dither(theme.colors.sky[0], theme.colors.sky[1], 4)}
  box-shadow: inset 0 0 0 2px ${theme.colors.neutral.black};
`;

const CategoryTabs = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing['2xl']};
  flex-wrap: wrap;
`;

const CategoryTab = styled('button', { shouldForwardProp: prop => prop !== 'isActive' })<{
  isActive: boolean;
}>`
  padding: 8px 12px;
  border: none;
  border-radius: 0;
  background: ${props => (props.isActive ? theme.colors.primary.deep : theme.colors.background.primary)};
  box-shadow: ${props => pixelOutline(props.isActive ? theme.colors.primary.main : theme.colors.secondary.medium)};
  color: ${props => (props.isActive ? theme.colors.neutral.white : theme.colors.neutral.silver)};
  font-family: ${theme.typography.fonts.pixel};
  font-size: 14px;
  line-height: 1.2;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;

  /* Gold on the deep-blue active tab would drop below 4.5:1, so only inactive tabs */
  ${props => (props.isActive ? '' : `&:hover { color: ${theme.colors.accent.gold}; }`)}

  /* Global focus ring, pushed past the 2px pixel outline */
  &:focus-visible {
    outline-offset: 4px;
  }

  &:active {
    transform: translate(1px, 1px);
  }
`;

const SkillsList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const HelpText = styled.p`
  margin: 0;
  padding-top: ${theme.spacing.md};
  border-top: 2px solid ${theme.colors.secondary.medium};
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.base};
  line-height: ${theme.typography.lineHeights.snug};
  color: ${theme.colors.neutral.silver};
  text-align: center;
`;

export const SkillsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);
  const { t } = useTranslation('skills');

  const filteredSkills = activeCategory === 'all'
    ? skills
    : skills.filter(skill => skill.category === activeCategory);

  const handleSkillHover = (skill: Skill | null) => {
    setHoveredSkill(skill);
  };

  return (
    <PageTransition>
      <SkillsContainer>
        <ContentWrapper>
          <SectionTitle
            title={t('title')}
            subtitle={t('subtitle')}
            align="center"
          />

          <TwoColumnLayout>
            <SkillsColumn>
              <CategoryTabs role="group" aria-label={t('filterLabel')}>
                <CategoryTab
                  type="button"
                  isActive={activeCategory === 'all'}
                  aria-pressed={activeCategory === 'all'}
                  onClick={() => setActiveCategory('all')}
                >
                  {t('allCategory')}
                </CategoryTab>
                {skillCategories.map((category) => (
                  <CategoryTab
                    key={category.id}
                    type="button"
                    isActive={activeCategory === category.id}
                    aria-pressed={activeCategory === category.id}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {t(`categories.${category.id}`)}
                  </CategoryTab>
                ))}
              </CategoryTabs>

              {/* Keyed by filter: the list remounts and the bars refill step by step */}
              <SkillsList key={activeCategory}>
                {filteredSkills.map((skill, index) => (
                  <SkillBar
                    key={skill.name}
                    skill={skill}
                    index={index}
                    onHover={handleSkillHover}
                  />
                ))}
              </SkillsList>
            </SkillsColumn>

            <SpriteColumn>
              <SpriteTitle>{t('spriteTitle')}</SpriteTitle>
              <SpriteStage>
                <CharacterSprite
                  armorColor={hoveredSkill?.color || theme.colors.primary.main}
                  isCharging={hoveredSkill !== null}
                  skillName={hoveredSkill?.name}
                />
              </SpriteStage>
              <HelpText>
                {t('helpText')}
              </HelpText>
            </SpriteColumn>
          </TwoColumnLayout>
        </ContentWrapper>
      </SkillsContainer>
    </PageTransition>
  );
};

export default SkillsPage;
