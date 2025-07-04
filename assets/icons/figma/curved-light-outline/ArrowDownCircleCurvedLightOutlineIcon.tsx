import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDownCircleCurvedLightOutlineIcon component
 */
export const ArrowDownCircleCurvedLightOutlineIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M16.0896 10.9833C16.1786 10.8533 16.2206 10.7063 16.2206 10.5603C16.2206 10.3213 16.1066 10.0853 15.8946 9.94032C15.5526 9.70632 15.0856 9.79332 14.8516 10.1353C13.7646 11.7243 12.4176 13.2043 12.0316 13.3013C11.5846 13.2043 10.2376 11.7243 9.14764 10.1353C8.91364 9.79332 8.44764 9.70632 8.10564 9.94132C7.76464 10.1723 7.67764 10.6393 7.90964 10.9833C8.88764 12.4093 10.7176 14.7993 12.0006 14.7993C13.2846 14.7993 15.1136 12.4083 16.0896 10.9833Z"
      fill={color}
    />
    <Path
      d="M12 22C19.383 22 22 19.383 22 12C22 4.617 19.383 2 12 2C4.617 2 2 4.617 2 12C2 19.383 4.617 22 12 22ZM12 20.5C5.486 20.5 3.5 18.514 3.5 12C3.5 5.486 5.486 3.5 12 3.5C18.514 3.5 20.5 5.486 20.5 12C20.5 18.514 18.514 20.5 12 20.5Z"
      fill={color}
    />
  </Svg>
);

export default ArrowDownCircleCurvedLightOutlineIcon;
