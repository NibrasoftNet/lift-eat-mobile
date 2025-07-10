import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * LockSharpBrokenIcon component
 */
export const LockSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M12.1104 14.8071V17.0281"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M19.8596 21.854V9.98096H4.63965V21.854H14.8436"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.8104 9.83705V7.90505C16.8104 5.39205 14.7704 3.35405 12.2604 3.35405C9.75043 3.34305 7.70043 5.37105 7.69043 7.88505V7.90505V9.83705"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default LockSharpBrokenIcon;
