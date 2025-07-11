import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * LogoutRegularTwotoneIcon component
 */
export const LogoutRegularTwotoneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M15.016 7.38948V6.45648C15.016 4.42148 13.366 2.77148 11.331 2.77148H6.45597C4.42197 2.77148 2.77197 4.42148 2.77197 6.45648V17.5865C2.77197 19.6215 4.42197 21.2715 6.45597 21.2715H11.341C13.37 21.2715 15.016 19.6265 15.016 17.5975V16.6545"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M21.8096 12.0215H9.76855"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M18.8813 9.1062L21.8093 12.0212L18.8813 14.9372"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default LogoutRegularTwotoneIcon;
