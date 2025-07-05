import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * GameCurvedLightBorderIcon component
 */
export const GameCurvedLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M17.2081 15.5828H17.1059"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M9.25516 12.0625V15.6377"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M11.0794 13.8494H7.43164"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.4776 12.1707H15.3755"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.51416 2.21582C8.52084 2.92991 9.10605 3.5027 9.82013 3.49602H10.8283C11.9309 3.48743 12.833 4.37144 12.8483 5.47407V6.48124"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M21.8124 13.8953C21.8124 8.33539 19.4257 6.48145 12.2648 6.48145C5.10296 6.48145 2.71631 8.33539 2.71631 13.8953C2.71631 19.4562 5.10296 21.3092 12.2648 21.3092C19.4257 21.3092 21.8124 19.4562 21.8124 13.8953Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default GameCurvedLightBorderIcon;
