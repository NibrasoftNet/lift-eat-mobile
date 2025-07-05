import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * TimeCircleCurvedLightOutlineIcon component
 */
export const TimeCircleCurvedLightOutlineIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 3.5C7.30616 3.5 3.5 7.30527 3.5 12C3.5 16.6938 7.30621 20.5 12 20.5C16.6947 20.5 20.5 16.6938 20.5 12C20.5 7.30521 16.6948 3.5 12 3.5ZM2 12C2 6.47673 6.47784 2 12 2C17.5232 2 22 6.47679 22 12C22 17.5222 17.5233 22 12 22C6.47779 22 2 17.5222 2 12Z"
      fill={color}
    />
    <Path
      d="M11.6611 7.0957C12.0753 7.0957 12.4111 7.43149 12.4111 7.8457V11.9549L16.2034 12.0168C16.6175 12.0236 16.9478 12.3648 16.941 12.779C16.9343 13.1931 16.593 13.5234 16.1789 13.5166L11.6489 13.4426C11.2395 13.4359 10.9111 13.1021 10.9111 12.6927V7.8457C10.9111 7.43149 11.2469 7.0957 11.6611 7.0957Z"
      fill={color}
    />
  </Svg>
);

export default TimeCircleCurvedLightOutlineIcon;
