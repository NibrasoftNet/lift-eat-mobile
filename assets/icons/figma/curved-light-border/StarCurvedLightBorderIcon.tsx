import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * StarCurvedLightBorderIcon component
 */
export const StarCurvedLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 3C9.96385 3 9.77134 6.54652 8.55911 7.79957C7.34689 9.05263 3.5782 7.61992 3.05459 9.84403C2.53207 12.0693 5.92235 12.8243 6.34036 14.7334C6.76057 16.6426 4.68922 19.3249 6.45916 20.6598C8.22911 21.9936 10.1343 18.9747 12 18.9747C13.8656 18.9747 15.7709 21.9936 17.5408 20.6598C19.3108 19.3249 17.2405 16.6426 17.6596 14.7334C18.0787 12.8243 21.4679 12.0693 20.9454 9.84403C20.4229 7.61992 16.6531 9.05263 15.442 7.79957C14.2297 6.54652 14.0361 3 12 3Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default StarCurvedLightBorderIcon;
