import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * LocationCurvedBulkIcon component
 */
export const LocationCurvedBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.25 2.5C7.839 2.5 4.25 6.133 4.25 10.599C4.25 16.007 8.904 21.5 12.25 21.5C15.595 21.5 20.25 16.007 20.25 10.599C20.25 6.133 16.661 2.5 12.25 2.5Z"
      fill={color}
    />
    <Path
      d="M9.39697 10.7107C9.39697 12.2897 10.681 13.5737 12.26 13.5737C13.839 13.5737 15.124 12.2897 15.124 10.7107C15.124 9.13166 13.839 7.84766 12.26 7.84766C10.681 7.84766 9.39697 9.13166 9.39697 10.7107Z"
      fill={color}
    />
  </Svg>
);

export default LocationCurvedBulkIcon;
