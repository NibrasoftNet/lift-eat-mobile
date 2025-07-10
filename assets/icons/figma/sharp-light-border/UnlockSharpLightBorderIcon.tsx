import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * UnlockSharpLightBorderIcon component
 */
export const UnlockSharpLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M12.1812 14.6689V16.8899"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M19.9306 21.7163L19.9306 9.84277L4.70557 9.84277L4.70557 21.7163L19.9306 21.7163Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M7.7583 9.69875V7.76735V7.74735C7.7693 5.23335 9.8153 3.20535 12.3283 3.21635C13.6372 3.21635 14.8172 3.7692 15.6475 4.65406"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default UnlockSharpLightBorderIcon;
