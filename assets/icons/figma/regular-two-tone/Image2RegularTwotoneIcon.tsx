import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Image2RegularTwotoneIcon component
 */
export const Image2RegularTwotoneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M16.3025 2.74976H7.65051C4.63851 2.74976 2.74951 4.88376 2.74951 7.90376V16.0498C2.74951 19.0698 4.63051 21.2038 7.65051 21.2038H16.2975C19.3225 21.2038 21.2025 19.0698 21.2025 16.0498V7.90376C21.2065 4.88376 19.3255 2.74976 16.3025 2.74976Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M21.207 14.951C20.284 14.001 18.509 12.082 16.579 12.082C14.648 12.082 13.535 16.315 11.678 16.315C9.821 16.315 8.134 14.401 6.646 15.628C5.158 16.854 3.75 19.361 3.75 19.361"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M10.7027 8.78496C10.7027 9.80496 9.87674 10.631 8.85674 10.631C7.83774 10.631 7.01074 9.80496 7.01074 8.78496C7.01074 7.76496 7.83774 6.93896 8.85674 6.93896C9.87574 6.93996 10.7017 7.76596 10.7027 8.78496Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default Image2RegularTwotoneIcon;
