import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeftRegularLightOutlineIcon component
 */
export const ArrowLeftRegularLightOutlineIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M20 12.2744C20 12.6541 19.7178 12.9679 19.3518 13.0176L19.25 13.0244L4.25 13.0244C3.83579 13.0244 3.5 12.6886 3.5 12.2744C3.5 11.8947 3.78215 11.5809 4.14823 11.5313L4.25 11.5244L19.25 11.5244C19.6642 11.5244 20 11.8602 20 12.2744Z" fill={color} />
    <Path d="M10.829 17.7673C11.1225 18.0595 11.1235 18.5344 10.8313 18.8279C10.5656 19.0948 10.149 19.1199 9.85489 18.9027L9.77062 18.8302L3.72062 12.8062C3.45298 12.5397 3.42863 12.1216 3.64759 11.8276L3.72057 11.7433L9.77057 5.71833C10.0641 5.42604 10.5389 5.42703 10.8312 5.72052C11.0969 5.98734 11.1203 6.40406 10.9018 6.69721L10.829 6.78118L5.313 12.2751L10.829 17.7673Z" fill={color} />
  </Svg>
);

export default ArrowLeftRegularLightOutlineIcon;
