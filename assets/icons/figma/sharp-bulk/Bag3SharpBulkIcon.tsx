import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Bag3SharpBulkIcon component
 */
export const Bag3SharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M2.5 6.95215V12.3921C2.5 17.7721 6.87 22.1421 12.25 22.1421C17.63 22.1421 22 17.7721 22 12.3921V6.95215H2.5Z"
      fill={color}
    />
    <Path
      d="M7.48048 6.87493C7.49183 4.24547 9.63258 2.12481 12.2611 2.13529C14.8891 2.13617 17.0194 4.26727 17.0194 6.89625V10.8695H15.5194V6.89625C15.5194 5.0949 14.0595 3.63529 12.2595 3.63529H12.2563C10.4552 3.62751 8.98907 5.07973 8.98047 6.87988V10.8695H7.48047L7.48048 6.87493Z"
      fill={color}
    />
  </Svg>
);

export default Bag3SharpBulkIcon;
