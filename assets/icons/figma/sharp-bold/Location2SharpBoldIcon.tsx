import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Location2SharpBoldIcon component
 */
export const Location2SharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M12.2504 12.6387C10.7894 12.6387 9.60044 11.4497 9.60044 9.98867C9.60044 8.52767 10.7894 7.33867 12.2504 7.33867C13.7114 7.33867 14.9004 8.52767 14.9004 9.98867C14.9004 11.4497 13.7114 12.6387 12.2504 12.6387ZM17.6814 4.25767C16.2004 2.72967 14.2714 1.88867 12.2494 1.88867C10.2274 1.88867 8.29744 2.73067 6.81544 4.25967C5.31144 5.81067 4.48544 7.89467 4.55044 9.97667C4.65444 13.3207 6.91644 15.7617 8.91244 17.9147C10.4354 19.5567 11.7494 20.9747 11.7494 22.3887H12.7494C12.7494 20.9307 14.0664 19.5307 15.5904 17.9087C17.5844 15.7877 19.8454 13.3837 19.9494 9.97667C20.0134 7.89367 19.1864 5.80867 17.6814 4.25767Z"
      fill={color}
    />
  </Svg>
);

export default Location2SharpBoldIcon;
