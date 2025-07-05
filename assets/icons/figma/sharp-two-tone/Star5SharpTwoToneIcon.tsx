import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Star5SharpTwoToneIcon component
 */
export const Star5SharpTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M17.6869 10.0249H14.3267L12.2499 3.6333L10.1732 10.0249H3.45264L8.88965 13.9751L7.85127 17.1709"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M17.687 10.0249H21.0473L15.6103 13.9751L17.687 20.3667L12.25 16.4165L6.81299 20.3667L7.85137 17.1709"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default Star5SharpTwoToneIcon;
