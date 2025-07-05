import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * WorkRegularTwotoneIcon component
 */
export const WorkRegularTwotoneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M2.8042 15.4771C2.8042 15.4771 2.9462 17.2151 2.9792 17.7631C3.0232 18.4981 3.3072 19.3191 3.7812 19.8891C4.4502 20.6971 5.2382 20.9821 6.2902 20.9841C7.5272 20.9861 16.5222 20.9861 17.7592 20.9841C18.8112 20.9821 19.5992 20.6971 20.2682 19.8891C20.7422 19.3191 21.0262 18.4981 21.0712 17.7631C21.1032 17.2151 21.2452 15.4771 21.2452 15.4771"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M11.9951 16.6783V15.3843"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M2.75 8.38905V11.8561C4.668 13.1211 6.966 14.0071 9.488 14.3581C9.79 13.2571 10.783 12.4501 11.99 12.4501C13.178 12.4501 14.191 13.2571 14.473 14.3681C17.005 14.0171 19.312 13.1311 21.24 11.8561V8.38905C21.24 6.69505 19.877 5.33105 18.183 5.33105H5.817C4.123 5.33105 2.75 6.69505 2.75 8.38905Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.49609 5.32949V4.95849C8.49609 3.73849 9.48409 2.75049 10.7041 2.75049H13.2861C14.5051 2.75049 15.4941 3.73849 15.4941 4.95849L15.4951 5.32949"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default WorkRegularTwotoneIcon;
