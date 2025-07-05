import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Voice3SharpBoldIcon component
 */
export const Voice3SharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M11.9599 10.1771V11.6771H16.4399V11.8671C16.4399 14.1871 14.5599 16.0771 12.2499 16.0771C9.92988 16.0771 8.04988 14.1871 8.04988 11.8671V6.69705C8.04988 4.36705 9.92988 2.47705 12.2499 2.47705C14.5199 2.47705 16.3699 4.29705 16.4299 6.56705H13.0399V8.06705H16.4399V10.1771H11.9599Z"
      fill={color}
    />
    <Path
      d="M18.7777 11.147V11.897C18.7777 15.516 15.8487 18.46 12.2487 18.46C8.64968 18.46 5.72168 15.516 5.72168 11.897V11.147H4.22168V11.897C4.22168 16.088 7.42268 19.54 11.4977 19.922V22.731H12.9977V19.922C17.0747 19.541 20.2777 16.089 20.2777 11.897V11.147H18.7777Z"
      fill={color}
    />
  </Svg>
);

export default Voice3SharpBoldIcon;
