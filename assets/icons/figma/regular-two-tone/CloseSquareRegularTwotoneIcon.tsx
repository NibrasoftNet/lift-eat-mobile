import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CloseSquareRegularTwotoneIcon component
 */
export const CloseSquareRegularTwotoneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M10.1315 9.0625C9.8386 8.76957 9.36372 8.76953 9.0708 9.06239C8.77788 9.35525 8.77783 9.83012 9.07069 10.123L10.9385 11.9913L9.07325 13.8565C8.78035 14.1494 8.78035 14.6243 9.07325 14.9172C9.36614 15.2101 9.84101 15.2101 10.1339 14.9172L11.9991 13.052L13.8667 14.92C14.1596 15.213 14.6344 15.213 14.9273 14.9202C15.2203 14.6273 15.2203 14.1524 14.9275 13.8595L13.0597 11.9914L14.9259 10.1252C15.2188 9.83229 15.2188 9.35741 14.9259 9.06452C14.633 8.77163 14.1581 8.77163 13.8652 9.06452L11.9992 10.9306L10.1315 9.0625Z" fill={color} />
    <Path d="M16.3345 2.75024H7.66549C4.64449 2.75024 2.75049 4.88924 2.75049 7.91624V16.0842C2.75049 19.1112 4.63549 21.2502 7.66549 21.2502H16.3335C19.3645 21.2502 21.2505 19.1112 21.2505 16.0842V7.91624C21.2505 4.88924 19.3645 2.75024 16.3345 2.75024Z" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default CloseSquareRegularTwotoneIcon;
