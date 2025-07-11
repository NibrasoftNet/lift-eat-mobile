import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PlayCurvedBoldIcon component
 */
export const PlayCurvedBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M12.003 15.839C11.703 15.963 11.36 16.08 11.04 16.08C10.792 16.08 10.559 16.01 10.369 15.82C10.23 15.681 9.803 15.255 9.815 12.441C9.826 9.642 10.235 9.234 10.369 9.099C10.841 8.628 11.622 8.949 11.956 9.088C12.78 9.429 16.006 11.206 16.006 12.46C16.006 13.734 12.71 15.546 12.003 15.839ZM12.25 2.854C5.052 2.854 2.5 5.406 2.5 12.604C2.5 19.802 5.052 22.354 12.25 22.354C19.449 22.354 22 19.802 22 12.604C22 5.406 19.449 2.854 12.25 2.854Z"
      fill={color}
    />
  </Svg>
);

export default PlayCurvedBoldIcon;
