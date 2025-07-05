import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * VoiceSharpBoldIcon component
 */
export const VoiceSharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path d="M20.0051 13.229H21.5051V7.339H20.0051V13.229Z" fill={color} />
    <Path d="M2.99512 13.229H4.49512V7.339H2.99512V13.229Z" fill={color} />
    <Path
      d="M12.2506 2.479C9.61161 2.479 7.46461 4.635 7.46461 7.284V13.285C7.46461 15.676 9.21961 17.648 11.5006 18.013V21.229H8.77961V22.729H15.7196V21.229H13.0006V18.013C15.2816 17.648 17.0366 15.676 17.0366 13.285V7.284C17.0366 4.635 14.8896 2.479 12.2506 2.479Z"
      fill={color}
    />
  </Svg>
);

export default VoiceSharpBoldIcon;
