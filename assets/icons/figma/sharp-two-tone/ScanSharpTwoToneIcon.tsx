import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ScanSharpTwoToneIcon component
 */
export const ScanSharpTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M22.25 13.3204H2.25"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M20.4685 13.3193V20.7546H15.7656"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M4.03125 13.3193V20.7546H8.76363"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M20.4685 9.31018V4.31494H15.7656"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M4.03125 9.31018V4.31494H8.76363"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ScanSharpTwoToneIcon;
