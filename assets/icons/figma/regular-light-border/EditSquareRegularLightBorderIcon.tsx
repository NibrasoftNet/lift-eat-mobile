import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * EditSquareRegularLightBorderIcon component
 */
export const EditSquareRegularLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M11.4925 2.78894H7.75349C4.67849 2.78894 2.75049 4.96594 2.75049 8.04794V16.3619C2.75049 19.4439 4.66949 21.6209 7.75349 21.6209H16.5775C19.6625 21.6209 21.5815 19.4439 21.5815 16.3619V12.3339" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M8.82812 10.9209L16.3011 3.44787C17.2321 2.51787 18.7411 2.51787 19.6721 3.44787L20.8891 4.66487C21.8201 5.59587 21.8201 7.10587 20.8891 8.03587L13.3801 15.5449C12.9731 15.9519 12.4211 16.1809 11.8451 16.1809H8.09912L8.19312 12.4009C8.20712 11.8449 8.43412 11.3149 8.82812 10.9209Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M15.1655 4.60242L19.7315 9.16842" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default EditSquareRegularLightBorderIcon;
