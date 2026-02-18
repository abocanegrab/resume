import { useState } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { PageTransition } from '../components/common/PageTransition';
import { SectionTitle } from '../components/common/SectionTitle';
import { SkillBar } from '../components/skills/SkillBar';
import { CharacterSprite } from '../components/skills/CharacterSprite';
import { skills, skillCategories } from '../data/skills';
import type { Skill } from '../data/skills';
import { theme } from '../styles/theme';

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

const SpriteColumn = styled.div`
  position: sticky;
  top: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${theme.spacing.xl};
  background: ${theme.colors.background.card};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.secondary.main};

  @media (max-width: ${theme.breakpoints.laptop}) {
    position: relative;
    top: 0;
    order: -1;
    margin-bottom: ${theme.spacing.xl};
  }
`;

const SpriteTitle = styled.div`
  font-family: ${theme.typography.fonts.pixel};
  font-size: ${theme.typography.sizes.xs};
  color: ${theme.colors.neutral.silver};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: ${theme.spacing.md};
  text-align: center;
`;

const CategoryTabs = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing['2xl']};
  flex-wrap: wrap;
`;

const CategoryTab = styled.button<{ isActive: boolean; tabColor: string }>`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  background: ${props => props.isActive
    ? `${props.tabColor}20`
    : 'transparent'};
  color: ${props => props.isActive
    ? props.tabColor
    : theme.colors.neutral.silver};
  border: 1px solid ${props => props.isActive
    ? props.tabColor
    : theme.colors.secondary.main};
  border-radius: ${theme.borderRadius.full};
  font-family: ${theme.typography.fonts.body};
  font-size: ${theme.typography.sizes.sm};
  cursor: pointer;
  transition: all ${theme.transitions.fast};

  &:hover {
    border-color: ${props => props.tabColor};
    color: ${props => props.tabColor};
  }
`;

const SkillsList = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const HelpText = styled.div`
  font-family: ${theme.typography.fonts.mono};
  font-size: ${theme.typography.sizes.xs};
  color: ${theme.colors.neutral.lightGray};
  text-align: center;
  margin-top: ${theme.spacing.md};
  padding: ${theme.spacing.sm};
  border-top: 1px solid ${theme.colors.secondary.main};
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
              <CategoryTabs>
                <CategoryTab
                  isActive={activeCategory === 'all'}
                  tabColor={theme.colors.primary.main}
                  onClick={() => setActiveCategory('all')}
                >
                  {t('allCategory')}
                </CategoryTab>
                {skillCategories.map((category) => (
                  <CategoryTab
                    key={category.id}
                    isActive={activeCategory === category.id}
                    tabColor={category.color}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {t(`categories.${category.id}`)}
                  </CategoryTab>
                ))}
              </CategoryTabs>

              <AnimatePresence mode="wait">
                <SkillsList
                  key={activeCategory}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {filteredSkills.map((skill, index) => (
                    <SkillBar
                      key={skill.name}
                      skill={skill}
                      index={index}
                      onHover={handleSkillHover}
                    />
                  ))}
                </SkillsList>
              </AnimatePresence>
            </SkillsColumn>

            <SpriteColumn>
              <SpriteTitle>{t('spriteTitle')}</SpriteTitle>
              <CharacterSprite
                armorColor={hoveredSkill?.color || theme.colors.primary.main}
                isCharging={hoveredSkill !== null}
                skillName={hoveredSkill?.name}
              />
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
