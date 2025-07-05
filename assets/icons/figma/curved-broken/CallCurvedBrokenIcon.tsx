import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CallCurvedBrokenIcon component
 */
export const CallCurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M8.19994 15.7989C1.30294 8.89994 2.28294 5.74094 3.01094 4.72294C3.10394 4.55894 5.40594 1.11194 7.87494 3.13394C14.0009 8.17994 6.24494 7.46594 11.3889 12.6109C16.5349 17.7559 15.8209 9.99994 20.8659 16.1249C22.8879 18.5939 19.4409 20.8969 19.2779 20.9889C18.3869 21.6259 15.8559 22.4569 10.6149 18.0329"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default CallCurvedBrokenIcon;
