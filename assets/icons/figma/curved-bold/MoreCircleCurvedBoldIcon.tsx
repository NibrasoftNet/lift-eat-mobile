import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * MoreCircleCurvedBoldIcon component
 */
export const MoreCircleCurvedBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M15.463 15.4347C14.911 15.4347 14.459 14.9877 14.459 14.4347C14.459 13.8817 14.902 13.4347 15.454 13.4347H15.463C16.015 13.4347 16.463 13.8817 16.463 14.4347C16.463 14.9877 16.015 15.4347 15.463 15.4347ZM12.463 11.4347C11.911 11.4347 11.459 10.9877 11.459 10.4347C11.459 9.88167 11.902 9.43467 12.454 9.43467H12.463C13.015 9.43467 13.463 9.88167 13.463 10.4347C13.463 10.9877 13.015 11.4347 12.463 11.4347ZM9.455 15.4347C8.903 15.4347 8.45 14.9877 8.45 14.4347C8.45 13.8817 8.894 13.4347 9.446 13.4347H9.455C10.007 13.4347 10.455 13.8817 10.455 14.4347C10.455 14.9877 10.007 15.4347 9.455 15.4347ZM12.25 2.78467C5.051 2.78467 2.5 5.33567 2.5 12.5347C2.5 19.7327 5.051 22.2847 12.25 22.2847C19.449 22.2847 22 19.7327 22 12.5347C22 5.33567 19.449 2.78467 12.25 2.78467Z"
      fill={color}
    />
  </Svg>
);

export default MoreCircleCurvedBoldIcon;
