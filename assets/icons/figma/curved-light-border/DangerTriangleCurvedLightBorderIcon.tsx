import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DangerTriangleCurvedLightBorderIcon component
 */
export const DangerTriangleCurvedLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 21C5.50558 21 2.95666 20.5387 2.54353 18.2033C2.13039 15.8679 4.77383 11.4774 5.58842 10.0285C8.31257 5.18408 10.1637 3 12 3C13.8363 3 15.6874 5.18408 18.4116 10.0285C19.2262 11.4774 21.8696 15.8679 21.4565 18.2033C21.0444 20.5387 18.4944 21 12 21Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M11.9955 15.8945H12.0045"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path d="M12 8.5V12.395" fill='none' stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default DangerTriangleCurvedLightBorderIcon;
