import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PaperUploadSharpLightBorderIcon component
 */
export const PaperUploadSharpLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M14.8179 2.88867L4.5752 2.88867V21.3887H19.9245V8.20693L14.8179 2.88867Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M11.1143 10.6196L11.1143 18.466"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.52746 13.2065C9.85729 13.2065 11.1143 12.0354 11.1143 10.6197"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M13.7011 13.2065C12.3712 13.2065 11.1143 12.0354 11.1143 10.6197"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M14.3428 3.44336V8.78878H19.4498"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default PaperUploadSharpLightBorderIcon;
