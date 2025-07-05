import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PlusCurvedTwoToneIcon component
 */
export const PlusCurvedTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12.0366 8.46289V15.6113"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.6143 12.0371H8.4585"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M2.2998 12.0366C2.2998 4.73454 4.73454 2.2998 12.0366 2.2998C19.3388 2.2998 21.7735 4.73454 21.7735 12.0366C21.7735 19.3388 19.3388 21.7735 12.0366 21.7735C4.73454 21.7735 2.2998 19.3388 2.2998 12.0366Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default PlusCurvedTwoToneIcon;
