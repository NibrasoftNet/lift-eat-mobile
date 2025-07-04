import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CupSizeLargeRegularBoldIcon component
 */
export const CupSizeLargeRegularBoldIcon = ({ color = "#00A9F1", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 40 56"
    fill="none"
    {...props}
  >
    <Path d="M133.642 95.688H106.358C104.658 95.688 103 98.1045 103 98.701V100.71V141.546V143.639V143.705C103 144.515 105.204 146.944 106.358 146.944H133.642C134.586 146.944 137 144.346 137 143.705V143.639V141.546V100.71V98.701C137 97.948 135.618 95.688 133.642 95.688Z" fill="#C5EAFF"/>
    <Path d="M120 146.944H133.642C134.586 146.944 137 144.346 137 143.705V143.639V141.546V100.71V98.701C137 97.948 135.618 95.688 133.642 95.688H120V146.944Z" fill="#B0DCF9"/>
    <Path d="M137 143.336H103V99.1793H137V143.336Z" fill={color}/>
    <Path d="M137 143.336H120V99.1793H137V143.336Z" fill={color === "#00A9F1" ? "#1A96F0" : color}/>
    <Path d="M134.531 95.9703H105.729C105.216 95.9703 104.797 95.5507 104.797 95.0384V94.9319C104.797 94.4196 105.216 94 105.729 94H134.531C135.045 94 135.463 94.4196 135.463 94.9319V95.0384C135.463 95.5507 135.045 95.9703 134.531 95.9703Z" fill="#C5EAFF"/>
    <Path d="M120 95.9703H134.293C134.937 95.9703 135.463 95.5262 135.463 94.9851C135.463 94.443 134.937 94 134.293 94H120V95.9703Z" fill="#B0DCF9"/>
  </Svg>
);

export default CupSizeLargeRegularBoldIcon;
