import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DangerCircleCurvedBoldIcon component
 */
export const DangerCircleCurvedBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M12.254 16.7847C11.84 16.7847 11.499 16.4487 11.499 16.0347C11.499 15.6207 11.831 15.2847 12.245 15.2847H12.254C12.668 15.2847 13.004 15.6207 13.004 16.0347C13.004 16.4487 12.668 16.7847 12.254 16.7847ZM11.5 8.63967C11.5 8.22567 11.836 7.88967 12.25 7.88967C12.664 7.88967 13 8.22567 13 8.63967V12.5347C13 12.9487 12.664 13.2847 12.25 13.2847C11.836 13.2847 11.5 12.9487 11.5 12.5347V8.63967ZM12.25 2.78467C5.052 2.78467 2.5 5.33667 2.5 12.5347C2.5 19.7327 5.052 22.2847 12.25 22.2847C19.448 22.2847 22 19.7327 22 12.5347C22 5.33667 19.448 2.78467 12.25 2.78467Z"
      fill={color}
    />
  </Svg>
);

export default DangerCircleCurvedBoldIcon;
