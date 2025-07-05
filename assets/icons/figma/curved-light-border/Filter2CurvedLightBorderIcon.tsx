import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Filter2CurvedLightBorderIcon component
 */
export const Filter2CurvedLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12.0037 21C9.99225 21 9.98372 18.9937 9.98372 15.5995C9.98372 12.2052 3 9.82718 3 6.10082C3 2.95304 5.79029 3.00004 11.9995 3.00004C18.2097 3.00004 21 2.95304 21 6.10082C21 9.82718 14.0173 12.2052 14.0173 15.5995C14.0173 18.9937 14.0141 21 12.0037 21Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default Filter2CurvedLightBorderIcon;
