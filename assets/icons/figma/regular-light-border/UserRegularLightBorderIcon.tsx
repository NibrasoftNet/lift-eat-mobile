import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * UserRegularLightBorderIcon component
 */
export const UserRegularLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M11.8867 14.6638C8.67273 14.6638 5.92773 15.1508 5.92773 17.0958C5.92773 19.0398 8.65573 19.5408 11.8867 19.5408C15.1007 19.5408 17.8447 19.0588 17.8447 17.1128C17.8447 15.1668 15.1177 14.6638 11.8867 14.6638Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M19.7285 14.2502C21.0795 14.4522 22.0225 14.9252 22.0225 15.9002C22.0225 16.5712 21.5785 17.0072 20.8605 17.2812"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M4.044 14.2502C2.693 14.4522 1.75 14.9252 1.75 15.9002C1.75 16.5712 2.194 17.0072 2.912 17.2812"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M17.8877 10.8967C19.2827 10.7007 20.3567 9.50473 20.3597 8.05573C20.3597 6.62773 19.3187 5.44373 17.9537 5.21973"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M5.88509 10.8967C4.48909 10.7007 3.41609 9.50473 3.41309 8.05573C3.41309 6.62773 4.45409 5.44373 5.81909 5.21973"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M11.8869 11.8879C13.9959 11.8879 15.7059 10.1789 15.7059 8.06888C15.7059 5.95988 13.9959 4.24988 11.8869 4.24988C9.7779 4.24988 8.0679 5.95988 8.0679 8.06888C8.0599 10.1709 9.7569 11.8809 11.8589 11.8879H11.8869Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default UserRegularLightBorderIcon;
