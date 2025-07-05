import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ShieldDoneCurvedBrokenIcon component
 */
export const ShieldDoneCurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M15.3382 20.4213C17.5112 19.1983 19.6722 16.7763 19.6722 12.7003C19.6722 6.29627 19.9502 5.79527 19.3352 5.17927C18.7192 4.56327 15.5092 2.57227 12.0002 2.57227C8.49119 2.57227 5.28119 4.56327 4.66619 5.17927C4.05019 5.79527 4.32819 6.29627 4.32819 12.7003C4.32819 19.1053 9.66619 21.4273 12.0002 21.4273"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M9.40234 11.6964L11.2943 13.5914L15.1923 9.69141"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ShieldDoneCurvedBrokenIcon;
