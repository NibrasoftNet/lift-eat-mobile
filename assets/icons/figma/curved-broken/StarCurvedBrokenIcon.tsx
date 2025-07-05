import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * StarCurvedBrokenIcon component
 */
export const StarCurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 18.9758C13.866 18.9758 15.771 21.9948 17.541 20.6608C19.311 19.3258 17.241 16.6438 17.66 14.7348C18.079 12.8248 21.468 12.0698 20.945 9.84478C20.423 7.62078 16.653 9.05378 15.442 7.80078"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M14.1282 5.162C13.6542 4.022 13.0922 3 12.0002 3C9.96418 3 9.77118 6.547 8.55918 7.8C7.34718 9.053 3.57818 7.62 3.05518 9.844C2.53218 12.069 5.92218 12.824 6.34018 14.734C6.76118 16.643 4.68918 19.325 6.45918 20.66C7.41218 21.379 8.40518 20.835 9.40918 20.179"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default StarCurvedBrokenIcon;
