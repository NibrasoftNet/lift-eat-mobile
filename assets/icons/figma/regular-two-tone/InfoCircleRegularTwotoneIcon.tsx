import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * InfoCircleRegularTwotoneIcon component
 */
export const InfoCircleRegularTwotoneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 2.75024C17.109 2.75024 21.25 6.89224 21.25 12.0002C21.25 17.1082 17.109 21.2502 12 21.2502C6.892 21.2502 2.75 17.1082 2.75 12.0002C2.75 6.89224 6.892 2.75024 12 2.75024Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M11.995 15.7961H12.005"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M11.9951 8.20435V12.6233"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default InfoCircleRegularTwotoneIcon;
