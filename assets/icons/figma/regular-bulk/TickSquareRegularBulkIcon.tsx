import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * TickSquareRegularBulkIcon component
 */
export const TickSquareRegularBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M16.3405 1.99976H7.67049C4.28049 1.99976 2.00049 4.37976 2.00049 7.91976V16.0898C2.00049 19.6198 4.28049 21.9998 7.67049 21.9998H16.3405C19.7305 21.9998 22.0005 19.6198 22.0005 16.0898V7.91976C22.0005 4.37976 19.7305 1.99976 16.3405 1.99976Z" fill={color} />
    <Path d="M10.8134 15.2478C10.5894 15.2478 10.3654 15.1628 10.1944 14.9918L7.82144 12.6188C7.47944 12.2768 7.47944 11.7228 7.82144 11.3818C8.16344 11.0398 8.71644 11.0388 9.05844 11.3808L10.8134 13.1358L14.9414 9.00784C15.2834 8.66584 15.8364 8.66584 16.1784 9.00784C16.5204 9.34984 16.5204 9.90384 16.1784 10.2458L11.4324 14.9918C11.2614 15.1628 11.0374 15.2478 10.8134 15.2478Z" fill={color} />
  </Svg>
);

export default TickSquareRegularBulkIcon;
