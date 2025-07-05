import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * AddUserRegularLightBorderIcon component
 */
export const AddUserRegularLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M9.87651 15.2062C6.03251 15.2062 2.74951 15.7872 2.74951 18.1152C2.74951 20.4432 6.01251 21.0452 9.87651 21.0452C13.7215 21.0452 17.0035 20.4632 17.0035 18.1362C17.0035 15.8092 13.7415 15.2062 9.87651 15.2062Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M19.2036 8.66907V12.6791"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M21.2497 10.674H17.1597"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M9.8766 11.8859C12.3996 11.8859 14.4446 9.84088 14.4446 7.31788C14.4446 4.79488 12.3996 2.74988 9.8766 2.74988C7.3546 2.74988 5.3096 4.79488 5.3096 7.31788C5.3006 9.83188 7.3306 11.8769 9.8456 11.8859H9.8766Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default AddUserRegularLightBorderIcon;
