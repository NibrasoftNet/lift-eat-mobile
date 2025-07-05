import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * VolumeDownSharpTwoToneIcon component
 */
export const VolumeDownSharpTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M18.5645 7.99512C19.9896 10.4847 19.9896 13.525 18.5645 16.0068"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M9.24949 15.9363H4.86859C4.86644 13.3122 4.86644 10.688 4.86859 8.06378H9.24949L13.3754 4.4873H14.151V19.5127H13.3754L9.24949 15.9363Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default VolumeDownSharpTwoToneIcon;
