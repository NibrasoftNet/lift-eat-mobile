import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * WorkRegularLightBorderIcon component
 */
export const WorkRegularLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M11.9951 16.6768V14.1398" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M18.19 5.3302C19.88 5.3302 21.24 6.7002 21.24 8.3902V11.8302C18.78 13.2702 15.53 14.1402 11.99 14.1402C8.45 14.1402 5.21 13.2702 2.75 11.8302V8.3802C2.75 6.6902 4.12 5.3302 5.81 5.3302H18.19Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M15.4951 5.32576V4.95976C15.4951 3.73976 14.5051 2.74976 13.2851 2.74976H10.7051C9.48512 2.74976 8.49512 3.73976 8.49512 4.95976V5.32576" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M2.77441 15.4829L2.96341 17.9919C3.09141 19.6829 4.50041 20.9899 6.19541 20.9899H17.7944C19.4894 20.9899 20.8984 19.6829 21.0264 17.9919L21.2154 15.4829" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default WorkRegularLightBorderIcon;
