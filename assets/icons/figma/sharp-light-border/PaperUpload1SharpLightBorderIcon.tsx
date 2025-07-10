import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PaperUpload1SharpLightBorderIcon component
 */
export const PaperUpload1SharpLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M14.8179 2.75L4.5752 2.75V21.25H19.9245V8.06826L14.8179 2.75Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M11.1144 10.8057V16.8951"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M13.4781 12.6117L11.1143 10.2378L8.75049 12.6117"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M14.3423 3.30469V8.65011H19.4493"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default PaperUpload1SharpLightBorderIcon;
