import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ChartCurvedTwoToneIcon component
 */
export const ChartCurvedTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M16.5156 13.7979V16.9547"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M7.48286 10.2607V16.9544"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.0366 7.05762V16.9555"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M2.2998 12.0366C2.2998 4.73454 4.73454 2.2998 12.0366 2.2998C19.3388 2.2998 21.7735 4.73454 21.7735 12.0366C21.7735 19.3388 19.3388 21.7735 12.0366 21.7735C4.73454 21.7735 2.2998 19.3388 2.2998 12.0366Z"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ChartCurvedTwoToneIcon;
