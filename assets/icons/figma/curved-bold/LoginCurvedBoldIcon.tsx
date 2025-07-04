import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * LoginCurvedBoldIcon component
 */
export const LoginCurvedBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M3 11.37C2.59 11.37 2.25 11.71 2.25 12.12C2.25 12.54 2.59 12.87 3 12.87H7.05C7.04 12.37 7.04 11.87 7.05 11.37H3Z"
      fill={color}
    />
    <Path
      d="M14.65 2.25C9.34999 2.25 7.51999 3.55 7.14999 7.58V7.6C7.07999 8.85 7.05 10.11 7.05 11.37L13.36 11.37L11.72 9.74C11.43 9.44 11.43 8.97 11.72 8.68C12.01 8.38 12.49 8.38 12.78 8.67L15.71 11.59C15.85 11.73 15.93 11.92 15.93 12.12C15.93 12.32 15.85 12.51 15.71 12.65L12.78 15.57C12.64 15.71 12.45 15.79 12.25 15.79C12.06 15.79 11.87 15.71 11.72 15.57C11.43 15.27 11.43 14.8 11.72 14.51L13.37 12.87L7.05 12.87C7.05 14.05 7.08999 15.23 7.14999 16.42C7.51999 20.45 9.34999 21.75 14.65 21.75C22.25 21.75 22.25 18.9 22.25 12C22.25 5.1 22.25 2.25 14.65 2.25Z"
      fill={color}
    />
  </Svg>
);

export default LoginCurvedBoldIcon;
