import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * HideRegularTwotoneIcon component
 */
export const HideRegularTwotoneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M9.76045 14.3667C9.18545 13.7927 8.83545 13.0127 8.83545 12.1377C8.83545 10.3847 10.2474 8.97168 11.9994 8.97168C12.8664 8.97168 13.6644 9.32268 14.2294 9.89668"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.1049 12.6987C14.8729 13.9887 13.8569 15.0067 12.5679 15.2407"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M6.65451 17.4722C5.06751 16.2262 3.72351 14.4062 2.74951 12.1372C3.73351 9.85823 5.08651 8.02823 6.68351 6.77223C8.27051 5.51623 10.1015 4.83423 11.9995 4.83423C13.9085 4.83423 15.7385 5.52623 17.3355 6.79123"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M19.4473 8.99072C20.1353 9.90472 20.7403 10.9597 21.2493 12.1367C19.2823 16.6937 15.8063 19.4387 11.9993 19.4387C11.1363 19.4387 10.2853 19.2987 9.46729 19.0257"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M19.8868 4.24951L4.11279 20.0235"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default HideRegularTwotoneIcon;
