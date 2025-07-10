import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CallSilentSharpLightBorderIcon component
 */
export const CallSilentSharpLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M11.0589 14.78C12.6061 16.0214 14.0727 16.4234 14.0727 16.4234L16.9268 14.78L21.5375 18.18C20.6797 19.7125 19.5983 20.794 18.0657 21.6518C14.2627 21.8259 10.8632 20.1352 8.25687 17.7365M6.30437 15.6331C3.87762 12.5766 2.60428 9.01789 3.04979 6.63582C3.91833 5.14337 5.0316 4.03798 6.52155 3.16406L9.76207 7.6153L8.11867 10.4694C8.11867 10.4694 8.33819 11.3911 9.04649 12.527"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M4.26458 21.9482L18.8793 6.35913"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default CallSilentSharpLightBorderIcon;
