import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PaperFailSharpTwoToneIcon component
 */
export const PaperFailSharpTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M13.4059 15.8326L9.91211 12.3389M9.914 15.8326L13.4078 12.3389"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M14.8179 2.75L4.5752 2.75V21.25H19.9245V8.06826L14.8179 2.75Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M14.3418 3.30469V8.65011H19.4489"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default PaperFailSharpTwoToneIcon;
