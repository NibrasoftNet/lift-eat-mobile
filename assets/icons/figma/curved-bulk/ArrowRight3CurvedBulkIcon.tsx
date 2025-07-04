import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRight3CurvedBulkIcon component
 */
export const ArrowRight3CurvedBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M13.0622 6.91169C12.5262 7.44669 12.3412 9.25869 12.2912 11.0037L12.2852 13.0037C12.3382 15.2407 12.5982 16.6107 13.0622 17.0747C13.6262 17.6377 14.5662 17.3487 15.3222 17.0347C16.8912 16.3837 21.4272 13.6377 21.4272 11.9927C21.4272 10.2977 16.6892 7.56069 15.2502 6.96369C14.4682 6.63869 13.5972 6.37869 13.0622 6.91169Z" fill={color} />
    <Path d="M12.2902 11.0039L4.07324 11.0039C3.52024 11.0039 3.07324 11.4509 3.07324 12.0039C3.07324 12.5569 3.52024 13.0039 4.07324 13.0039L12.2842 13.0039L12.2902 11.0039Z" fill={color} />
  </Svg>
);

export default ArrowRight3CurvedBulkIcon;
