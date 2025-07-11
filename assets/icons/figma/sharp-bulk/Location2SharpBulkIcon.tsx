import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Location2SharpBulkIcon component
 */
export const Location2SharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M17.6814 4.25767C16.2004 2.72967 14.2714 1.88867 12.2494 1.88867C10.2274 1.88867 8.29744 2.73067 6.81544 4.25967C5.31144 5.81067 4.48544 7.89467 4.55044 9.97667C4.65444 13.3207 6.91644 15.7617 8.91244 17.9147C10.4354 19.5567 11.7494 20.9747 11.7494 22.3887H12.7494C12.7494 20.9307 14.0664 19.5307 15.5904 17.9087C17.5844 15.7877 19.8454 13.3837 19.9494 9.97667C20.0134 7.89367 19.1864 5.80867 17.6814 4.25767Z"
      fill={color}
    />
    <Path
      d="M9.60059 9.98887C9.60059 11.4499 10.7896 12.6389 12.2506 12.6389C13.7116 12.6389 14.9006 11.4499 14.9006 9.98887C14.9006 8.52787 13.7116 7.33887 12.2506 7.33887C10.7896 7.33887 9.60059 8.52787 9.60059 9.98887Z"
      fill={color}
    />
  </Svg>
);

export default Location2SharpBulkIcon;
