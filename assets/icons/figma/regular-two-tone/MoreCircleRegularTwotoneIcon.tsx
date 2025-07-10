import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * MoreCircleRegularTwotoneIcon component
 */
export const MoreCircleRegularTwotoneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 2.75024C17.108 2.75024 21.25 6.89224 21.25 12.0002C21.25 17.1082 17.108 21.2502 12 21.2502C6.891 21.2502 2.75 17.1082 2.75 12.0002C2.75 6.89224 6.891 2.75024 12 2.75024Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.4788 13.1975C15.8178 13.1975 15.2808 12.6605 15.2808 12.0005C15.2808 11.3405 15.8178 10.8025 16.4788 10.8025C17.1398 10.8025 17.6768 11.3405 17.6768 12.0005C17.6768 12.6605 17.1398 13.1975 16.4788 13.1975Z"
      fill={color}
    />
    <Path
      d="M11.9998 13.1975C11.3388 13.1975 10.8018 12.6605 10.8018 12.0005C10.8018 11.3405 11.3388 10.8025 11.9998 10.8025C12.6608 10.8025 13.1978 11.3405 13.1978 12.0005C13.1978 12.6605 12.6608 13.1975 11.9998 13.1975Z"
      fill={color}
    />
    <Path
      d="M7.52027 13.1975C6.85927 13.1975 6.32227 12.6605 6.32227 12.0005C6.32227 11.3405 6.85927 10.8025 7.52027 10.8025C8.18127 10.8025 8.71827 11.3405 8.71827 12.0005C8.71827 12.6605 8.18127 13.1975 7.52027 13.1975Z"
      fill={color}
    />
  </Svg>
);

export default MoreCircleRegularTwotoneIcon;
