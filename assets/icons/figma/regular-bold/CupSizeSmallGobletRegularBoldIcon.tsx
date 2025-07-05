import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CupSizeSmallGobletRegularBoldIcon component
 */
export const CupSizeSmallGobletRegularBoldIcon = ({
  color = '#00A9F1',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 40 50" fill="none" {...props}>
    <Path
      d="M35.1216 49.866H6.87831C5.14328 49.866 3.7369 48.4595 3.7369 46.7245L3 6.39621C3 5.64096 3.61238 5.02856 4.36865 5.02856H37.6313C38.3865 5.02856 38.9999 5.64096 38.9999 6.39621L38.263 46.7245C38.263 48.4595 36.8566 49.866 35.1216 49.866Z"
      fill="#C5EAFF"
    />
    <Path
      d="M21.001 49.8374H35.1221C36.8571 49.8374 38.2635 48.431 38.2635 46.6959L39.0004 6.36864C39.0004 5.61237 38.387 4.99999 37.6318 4.99999H21.001V49.8374Z"
      fill="#B0DCF9"
    />
    <Path
      d="M36.6774 24.7478L36.0364 41.5786C36.0364 42.3022 34.8117 42.8901 33.3002 42.8901H8.70047C7.18895 42.8901 5.96421 42.3022 5.96421 41.5786L5.32324 24.7478H36.6774Z"
      fill={color}
    />
    <Path
      d="M20.916 42.8901H33.2153C34.7269 42.8901 35.9516 42.3022 35.9516 41.5786L36.5936 24.7478H20.916V42.8901Z"
      fill={color === '#00A9F1' ? '#1A96F0' : color}
    />
  </Svg>
);

export default CupSizeSmallGobletRegularBoldIcon;
