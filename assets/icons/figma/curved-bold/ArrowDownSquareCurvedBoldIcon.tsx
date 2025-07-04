import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDownSquareCurvedBoldIcon component
 */
export const ArrowDownSquareCurvedBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M16.622 12.74C15.795 13.971 13.712 16.836 12.25 16.836C10.788 16.836 8.705 13.971 7.878 12.74C7.646 12.397 7.738 11.93 8.081 11.7C8.428 11.468 8.893 11.561 9.122 11.903C9.915 13.083 10.831 14.181 11.5 14.806V7.914C11.5 7.5 11.836 7.164 12.25 7.164C12.664 7.164 13 7.5 13 7.914V14.813C13.662 14.19 14.581 13.088 15.378 11.903C15.608 11.56 16.074 11.468 16.419 11.7C16.762 11.93 16.853 12.397 16.622 12.74ZM12.25 2.25C5.052 2.25 2.5 4.802 2.5 12C2.5 19.198 5.052 21.75 12.25 21.75C19.448 21.75 22 19.198 22 12C22 4.802 19.448 2.25 12.25 2.25Z"
      fill={color}
    />
  </Svg>
);

export default ArrowDownSquareCurvedBoldIcon;
