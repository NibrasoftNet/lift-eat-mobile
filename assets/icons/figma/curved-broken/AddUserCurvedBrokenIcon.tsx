import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * AddUserCurvedBrokenIcon component
 */
export const AddUserCurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M9.90794 21.8292C6.09394 21.8292 2.83594 21.2522 2.83594 18.9422C2.83594 16.6322 6.07294 14.5312 9.90794 14.5312C13.7219 14.5312 16.9799 16.6122 16.9799 18.9212C16.9799 20.5472 15.3739 21.3252 13.0849 21.6432"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M19.1172 8.15039V12.1604"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M21.1642 10.1553H17.0742"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M9.90803 2.1709C7.40503 2.1709 5.37503 4.1999 5.37503 6.7039C5.36603 9.1979 7.38203 11.2279 9.87603 11.2369H9.90803C12.411 11.2369 14.441 9.2069 14.441 6.7039C14.441 5.2059 13.715 3.8779 12.595 3.0529"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default AddUserCurvedBrokenIcon;
