import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Image3RegularLightBorderIcon component
 */
export const Image3RegularLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M16.3025 2.74976H7.65051C4.63851 2.74976 2.74951 4.88376 2.74951 7.90376V16.0498C2.74951 19.0698 4.63051 21.2038 7.65051 21.2038H16.2975C19.3225 21.2038 21.2025 19.0698 21.2025 16.0498V7.90376C21.2065 4.88376 19.3255 2.74976 16.3025 2.74976Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M21.207 14.9509C20.284 14.0009 18.509 12.0819 16.579 12.0819C14.648 12.0819 13.535 16.3149 11.678 16.3149C9.821 16.3149 8.134 14.4009 6.646 15.6279C5.158 16.8539 3.75 19.3609 3.75 19.3609" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M10.7027 8.78496C10.7027 9.80496 9.87674 10.631 8.85674 10.631C7.83774 10.631 7.01074 9.80496 7.01074 8.78496C7.01074 7.76496 7.83774 6.93896 8.85674 6.93896C9.87574 6.93996 10.7017 7.76596 10.7027 8.78496Z" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default Image3RegularLightBorderIcon;
