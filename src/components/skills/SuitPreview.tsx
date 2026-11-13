import { useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { theme } from '../../styles/theme';
import { readableTone } from '../../styles/color';
import { SegmentBar } from '../common/SegmentBar';
import { prefersReducedMotion } from '../../game/assets';
import { DEMO_H, DEMO_W, startWeaponDemo, type WeaponDemo } from '../../game/weaponDemo';
import type { Skill } from '../../data/skills';

interface SuitPreviewProps {
  /** The equipped technology: the hero wears its color and fires its category's weapon. */
  skill: Skill;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const Room = styled.canvas`
  display: block;
  width: 100%;
  height: auto;
  image-rendering: pixelated;
  box-shadow: inset 0 0 0 2px ${theme.colors.neutral.black};
`;

// White text with a hard 2px shadow in the weapon color, like a weapon-get screen
const SkillName = styled('div', { shouldForwardProp: (prop) => prop !== 'shadowColor' })<{ shadowColor: string }>`
  font-family: ${theme.typography.fonts.pixel};
  font-size: 18px;
  line-height: 1.3;
  color: ${(props) => props.shadowColor};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-shadow: 2px 2px 0 ${theme.colors.neutral.black};
  overflow-wrap: anywhere;
`;

const Technique = styled.div`
  font-family: ${theme.typography.fonts.pixel};
  font-size: 14px;
  line-height: 1.4;
  color: ${theme.colors.accent.gold};
  text-transform: uppercase;
`;

const Energy = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: ${theme.spacing.sm};
  font-family: ${theme.typography.fonts.pixel};
  font-size: 14px;
  color: ${theme.colors.neutral.silver};
`;

/** Weapon test room: the hero equips the selected technology and tries its weapon on a bug. */
export const SuitPreview: React.FC<SuitPreviewProps> = ({ skill }) => {
  const { t } = useTranslation('skills');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const demo = useRef<WeaponDemo | null>(null);
  const tone = readableTone(skill.color);

  useEffect(() => {
    if (!canvasRef.current) return;
    demo.current = startWeaponDemo(canvasRef.current, { kind: skill.category, color: skill.color }, prefersReducedMotion());
    return () => demo.current?.stop();
    // Created once; later skills are equipped on the running demo
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    demo.current?.equip({ kind: skill.category, color: skill.color });
  }, [skill]);

  return (
    <Wrapper>
      <Room ref={canvasRef} width={DEMO_W} height={DEMO_H} aria-hidden="true" />
      <div aria-live="polite">
        <SkillName shadowColor={tone}>{skill.name}</SkillName>
        <Technique>{t(`techniques.${skill.category}`)}</Technique>
      </div>
      <Energy aria-hidden="true">
        <span>EN</span>
        <SegmentBar cells={20} filled={Math.round(skill.level / 5)} tone={tone} />
      </Energy>
    </Wrapper>
  );
};

export default SuitPreview;
