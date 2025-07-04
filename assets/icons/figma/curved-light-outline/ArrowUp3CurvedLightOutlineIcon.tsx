import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUp3CurvedLightOutlineIcon component
 */
export const ArrowUp3CurvedLightOutlineIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M6.96017 9.13731C6.77217 9.59031 6.60617 10.0733 6.60617 10.5033C6.60617 10.8123 6.69117 11.0933 6.91517 11.3163C7.38058 11.7799 9.23922 12.0371 11.25 12.0877L11.25 20.3045C11.25 20.7185 11.586 21.0545 12 21.0545C12.414 21.0545 12.75 20.7185 12.75 20.3045L12.75 12.0873C14.7565 12.0358 16.6091 11.7785 17.0732 11.3153C17.6362 10.7513 17.3492 9.81831 17.0392 9.06531C16.3882 7.49231 13.6412 2.94531 11.9932 2.94531C10.2922 2.94531 7.55717 7.69531 6.96017 9.13731ZM8.12517 10.3153C8.36517 9.01931 11.0362 4.95231 11.9952 4.46631C12.9912 4.95031 15.6862 9.01831 15.8842 10.2913C14.6302 10.7043 9.32717 10.6973 8.12517 10.3153Z" fill={color} />
  </Svg>
);

export default ArrowUp3CurvedLightOutlineIcon;
