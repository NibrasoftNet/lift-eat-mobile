import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CallCurvedBoldIcon component
 */
export const CallCurvedBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M21.4972 16.4126C18.8592 13.2126 17.5442 13.4996 16.0982 14.2026C15.0972 14.6886 14.2332 15.1106 11.9872 12.8636C9.74117 10.6166 10.1622 9.7536 10.6482 8.7546C11.3532 7.3076 11.6392 5.9896 8.43617 3.3526C7.67317 2.7276 6.84117 2.4876 5.97517 2.6556C4.14217 2.9986 2.84717 5.0386 2.84917 5.0386C2.03717 6.1746 0.925165 9.5906 8.09216 16.7586C12.8062 21.4736 15.8972 22.6046 17.7732 22.6046C18.7502 22.6046 19.3962 22.2986 19.7702 22.0296C19.7912 22.0176 21.8492 20.7426 22.1962 18.8736C22.3582 18.0046 22.1232 17.1776 21.4972 16.4126Z" fill={color} />
  </Svg>
);

export default CallCurvedBoldIcon;
