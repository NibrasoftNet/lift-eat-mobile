import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CupSizeMediumGlassRegularBoldIcon component
 */
export const CupSizeMediumGlassRegularBoldIcon = ({ color = "#00A9F1", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 37 53"
    fill="none"
    {...props}
  >
    <Path d="M34.8102 137.785H2.31843C1.03882 137.785 0 136.747 0 135.467V87.3183C0 86.0377 1.03882 84.9999 2.31843 84.9999H34.8102C36.0908 84.9999 37.1286 86.0377 37.1286 87.3183V135.467C37.1286 136.747 36.0908 137.785 34.8102 137.785Z" fill={color}/>
    <Path d="M18.5645 137.785H35.6969C36.4879 137.785 37.1288 137.145 37.1288 136.353V86.4318C37.1288 85.6417 36.4879 84.9999 35.6969 84.9999H18.5645V137.785Z" fill={color === "#00A9F1" ? "#1A96F0" : color}/>
    <Path d="M42.3977 117.807H35.5479V114.349H42.0962C42.2404 114.141 42.4215 113.696 42.4215 113.193V101.253C42.4215 100.849 42.2623 100.608 41.9947 100.608H35.5479V97.1502H41.9947C43.937 97.1502 45.9997 98.3264 45.9997 100.507V113.939C45.9997 115.861 44.7628 117.807 42.3977 117.807Z" fill={color}/>
  </Svg>
);

export default CupSizeMediumGlassRegularBoldIcon;
