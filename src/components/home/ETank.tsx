import { theme } from '../../styles/theme';

// 12x14 pixel E-Tank drawn at 2x: outline, cap, body, shading, shine and the "E"
export const ETank: React.FC<{ tone: string }> = ({ tone }) => {
  const ink = theme.colors.neutral.black;
  const shine = theme.colors.neutral.white;
  return (
    <svg
      width="24"
      height="28"
      viewBox="0 0 12 14"
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3" y="0" width="6" height="4" fill={ink} />
      <rect x="4" y="1" width="4" height="2" fill={tone} />
      <rect x="4" y="1" width="4" height="2" fill={ink} fillOpacity="0.35" />
      <rect x="0" y="3" width="12" height="11" fill={ink} />
      <rect x="1" y="4" width="10" height="9" fill={tone} />
      <rect x="8" y="4" width="3" height="9" fill={ink} fillOpacity="0.3" />
      <rect x="1" y="12" width="10" height="1" fill={ink} fillOpacity="0.3" />
      <rect x="2" y="5" width="1" height="4" fill={shine} fillOpacity="0.7" />
      <rect x="3" y="5" width="1" height="1" fill={shine} fillOpacity="0.7" />
      <path d="M5 6h3v1H6v1h2v1H6v1h2v1H5z" fill={ink} />
    </svg>
  );
};

export default ETank;
