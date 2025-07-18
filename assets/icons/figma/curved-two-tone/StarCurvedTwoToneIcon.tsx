import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * StarCurvedTwoToneIcon component
 */
export const StarCurvedTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 3C14.0361 3 14.2298 6.54652 15.442 7.79957C16.6531 9.05263 20.4229 7.61992 20.9454 9.84403C21.4679 12.0693 18.0787 12.8243 17.6596 14.7334C17.2405 16.6426 19.3108 19.3249 17.5408 20.6598C15.7709 21.9936 13.8656 18.9747 12 18.9747"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12 3C9.96385 3 9.77134 6.54652 8.55911 7.79957C7.34689 9.05263 3.5782 7.61992 3.05459 9.84403C2.53207 12.0693 5.92235 12.8243 6.34036 14.7334C6.76057 16.6426 4.68922 19.3249 6.45916 20.6598C8.22911 21.9936 10.1343 18.9747 12 18.9747"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default StarCurvedTwoToneIcon;
