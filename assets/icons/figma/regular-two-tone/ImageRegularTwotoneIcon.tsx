import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ImageRegularTwotoneIcon component
 */
export const ImageRegularTwotoneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M21.21 7.89924V16.0502C21.21 19.0702 19.32 21.2002 16.3 21.2002H7.65C4.63 21.2002 2.75 19.0702 2.75 16.0502V7.89924C2.75 4.87924 4.64 2.75024 7.65 2.75024H16.3C19.32 2.75024 21.21 4.87924 21.21 7.89924Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M5.28125 16.4311L6.80925 14.8181C7.34025 14.2551 8.22525 14.2281 8.78925 14.7581C8.80625 14.7751 9.72625 15.7101 9.72625 15.7101C10.2813 16.2751 11.1883 16.2841 11.7533 15.7301C11.7903 15.6941 14.0872 12.9081 14.0872 12.9081C14.6792 12.1891 15.7422 12.0861 16.4622 12.6791C16.5102 12.7191 18.6803 14.9461 18.6803 14.9461"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M10.3127 9.13315C10.3127 10.1022 9.52769 10.8872 8.55869 10.8872C7.58969 10.8872 6.80469 10.1022 6.80469 9.13315C6.80469 8.16415 7.58969 7.37915 8.55869 7.37915C9.52769 7.38015 10.3127 8.16415 10.3127 9.13315Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ImageRegularTwotoneIcon;
