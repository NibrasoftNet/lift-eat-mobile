import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PlusSharpTwoToneIcon component
 */
export const PlusSharpTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M12.2496 8.8623V16.1887M15.9173 12.5251H8.58398"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M21.5 21.7847L21.5 3.28467L3 3.28467L3 21.7847L21.5 21.7847Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default PlusSharpTwoToneIcon;
