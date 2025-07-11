import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * HideRegularLightBorderIcon component
 */
export const HideRegularLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M9.76045 14.3668C9.18545 13.7928 8.83545 13.0128 8.83545 12.1378C8.83545 10.3848 10.2474 8.9718 11.9994 8.9718C12.8664 8.9718 13.6644 9.3228 14.2294 9.8968"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.1049 12.699C14.8729 13.989 13.8569 15.007 12.5679 15.241"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M6.65451 17.4724C5.06751 16.2264 3.72351 14.4064 2.74951 12.1374C3.73351 9.85835 5.08651 8.02835 6.68351 6.77235C8.27051 5.51635 10.1015 4.83435 11.9995 4.83435C13.9085 4.83435 15.7385 5.52635 17.3355 6.79135"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M19.4473 8.99084C20.1353 9.90484 20.7403 10.9598 21.2493 12.1368C19.2823 16.6938 15.8063 19.4388 11.9993 19.4388C11.1363 19.4388 10.2853 19.2988 9.46729 19.0258"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M19.8868 4.24963L4.11279 20.0236"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default HideRegularLightBorderIcon;
