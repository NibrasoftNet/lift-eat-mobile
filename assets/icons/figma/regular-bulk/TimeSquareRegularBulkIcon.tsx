import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * TimeSquareRegularBulkIcon component
 */
export const TimeSquareRegularBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M16.34 1.99976H7.67C4.28 1.99976 2 4.37976 2 7.91976V16.0898C2 19.6198 4.28 21.9998 7.67 21.9998H16.34C19.73 21.9998 22 19.6198 22 16.0898V7.91976C22 4.37976 19.73 1.99976 16.34 1.99976Z"
      fill={color}
    />
    <Path
      d="M15.5734 15.8143C15.4424 15.8143 15.3104 15.7803 15.1894 15.7093L11.2634 13.3673C11.0374 13.2313 10.8984 12.9863 10.8984 12.7223V7.67529C10.8984 7.26129 11.2344 6.92529 11.6484 6.92529C12.0624 6.92529 12.3984 7.26129 12.3984 7.67529V12.2963L15.9584 14.4193C16.3134 14.6323 16.4304 15.0923 16.2184 15.4483C16.0774 15.6833 15.8284 15.8143 15.5734 15.8143Z"
      fill={color}
    />
  </Svg>
);

export default TimeSquareRegularBulkIcon;
