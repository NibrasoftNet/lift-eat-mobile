import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * VolumeUpSharpTwoToneIcon component
 */
export const VolumeUpSharpTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M16.6973 7.99512C18.1224 10.4847 18.1224 13.525 16.6973 16.0068"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M19.418 5.375C22.1894 9.36473 22.1985 14.6275 19.418 18.625"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M7.3823 15.9363H3.0014C2.99925 13.3122 2.99925 10.688 3.0014 8.06378H7.3823L11.5082 4.4873H12.2838V19.5127H11.5082L7.3823 15.9363Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default VolumeUpSharpTwoToneIcon;
