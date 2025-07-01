import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * VoiceRegularTwotoneIcon component
 */
export const VoiceRegularTwotoneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M5.46436 10.9319C5.46436 10.5177 5.12857 10.1819 4.71436 10.1819C4.30014 10.1819 3.96436 10.5177 3.96436 10.9319C3.96436 15.1829 7.21628 18.6734 11.3685 19.0517V21.1468C11.3685 21.561 11.7043 21.8968 12.1185 21.8968C12.5328 21.8968 12.8685 21.561 12.8685 21.1468V19.0516C17.0205 18.6729 20.272 15.1826 20.272 10.9319C20.272 10.5177 19.9362 10.1819 19.522 10.1819C19.1078 10.1819 18.772 10.5177 18.772 10.9319C18.772 14.6072 15.7935 17.5857 12.1182 17.5857C8.44285 17.5857 5.46436 14.6072 5.46436 10.9319Z" fill={color} />
    <Path d="M12.2444 14.5843H11.992C9.97108 14.5843 8.33203 12.9462 8.33203 10.9243V6.37387C8.33203 4.35291 9.97108 2.71387 11.992 2.71387H12.2444C14.2654 2.71387 15.9044 4.35291 15.9044 6.37387V10.9243C15.9044 12.9462 14.2654 14.5843 12.2444 14.5843Z" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default VoiceRegularTwotoneIcon;
