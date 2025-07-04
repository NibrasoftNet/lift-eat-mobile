import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PlusCurvedBoldIcon component
 */
export const PlusCurvedBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M15.8277 13.2849H12.9997V16.1089C12.9997 16.5229 12.6637 16.8589 12.2497 16.8589C11.8357 16.8589 11.4997 16.5229 11.4997 16.1089V13.2849H8.6717C8.2577 13.2849 7.9217 12.9489 7.9217 12.5349C7.9217 12.1209 8.2577 11.7849 8.6717 11.7849H11.4997V8.96085C11.4997 8.54685 11.8357 8.21085 12.2497 8.21085C12.6637 8.21085 12.9997 8.54685 12.9997 8.96085V11.7849H15.8277C16.2417 11.7849 16.5777 12.1209 16.5777 12.5349C16.5777 12.9489 16.2417 13.2849 15.8277 13.2849ZM12.2497 2.29785C4.6907 2.29785 2.0127 4.97585 2.0127 12.5349C2.0127 20.0939 4.6907 22.7719 12.2497 22.7719C19.8077 22.7719 22.4867 20.0939 22.4867 12.5349C22.4867 4.97585 19.8077 2.29785 12.2497 2.29785Z" fill={color} />
  </Svg>
);

export default PlusCurvedBoldIcon;
