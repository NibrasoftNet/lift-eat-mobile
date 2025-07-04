import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Filter3SharpTwoToneIcon component
 */
export const Filter3SharpTwoToneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M17.875 11.1587L14.5 14.6019V19.4382L10 21.1969V14.6019L6.625 11.1587" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M17.875 11.1585L21.25 7.71525V4.01074H12.25H3.25V7.71525L6.625 11.1585" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default Filter3SharpTwoToneIcon;
