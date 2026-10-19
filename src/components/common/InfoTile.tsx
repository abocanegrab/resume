import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import type { IconType } from 'react-icons';
import { theme } from '../../styles/theme';
import { pixelCard, pixelLabel, pixelOutline } from '../../styles/pixel';

interface InfoTileProps extends HTMLMotionProps<'li'> {
  icon: IconType;
  label: string;
  value: string;
}

// Muted pixel card (list item) with a framed icon, a pixel label and a value.
// Consumers adjust background/alignment/spacing with styled(InfoTile).
const Tile = styled(motion.li)`
  ${pixelCard('muted')}
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  min-width: 0;
`;

const IconBox = styled.span`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin: 2px;
  background: ${theme.colors.neutral.black};
  box-shadow: ${pixelOutline(theme.colors.secondary.medium)};
  color: ${theme.colors.primary.main};
  font-size: 18px;
`;

const Content = styled.div`
  min-width: 0;

  .label {
    ${pixelLabel}
    color: ${theme.colors.neutral.silver};
    margin-bottom: ${theme.spacing.xs};
  }

  .value {
    font-size: ${theme.typography.sizes.md};
    color: ${theme.colors.neutral.white};
    overflow-wrap: anywhere;
  }
`;

export const InfoTile: React.FC<InfoTileProps> = ({ icon: Icon, label, value, ...rest }) => (
  <Tile {...rest}>
    <IconBox aria-hidden="true">
      <Icon />
    </IconBox>
    <Content>
      <div className="label">{label}</div>
      <div className="value">{value}</div>
    </Content>
  </Tile>
);

export default InfoTile;
