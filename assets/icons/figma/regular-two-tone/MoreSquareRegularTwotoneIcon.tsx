import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * MoreSquareRegularTwotoneIcon component
 */
export const MoreSquareRegularTwotoneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M16.3345 2.75024H7.66549C4.64449 2.75024 2.75049 4.88924 2.75049 7.91624V16.0842C2.75049 19.1112 4.63449 21.2502 7.66549 21.2502H16.3335C19.3645 21.2502 21.2505 19.1112 21.2505 16.0842V7.91624C21.2505 4.88924 19.3645 2.75024 16.3345 2.75024Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M16.4788 13.1975C15.8178 13.1975 15.2808 12.6605 15.2808 12.0005C15.2808 11.3405 15.8178 10.8025 16.4788 10.8025C17.1398 10.8025 17.6768 11.3405 17.6768 12.0005C17.6768 12.6605 17.1398 13.1975 16.4788 13.1975Z" fill={color} />
    <Path d="M11.9998 13.1975C11.3388 13.1975 10.8018 12.6605 10.8018 12.0005C10.8018 11.3405 11.3388 10.8025 11.9998 10.8025C12.6608 10.8025 13.1978 11.3405 13.1978 12.0005C13.1978 12.6605 12.6608 13.1975 11.9998 13.1975Z" fill={color} />
    <Path d="M7.52075 13.1975C6.85975 13.1975 6.32275 12.6605 6.32275 12.0005C6.32275 11.3405 6.85975 10.8025 7.52075 10.8025C8.18175 10.8025 8.71875 11.3405 8.71875 12.0005C8.71875 12.6605 8.18175 13.1975 7.52075 13.1975Z" fill={color} />
  </Svg>
);

export default MoreSquareRegularTwotoneIcon;
