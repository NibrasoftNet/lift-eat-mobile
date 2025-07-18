import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUpSquareRegularLightOutlineIcon component
 */
export const ArrowUpSquareRegularLightOutlineIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M7.666 20.5C5.136 20.5 3.5 18.767 3.5 16.084V7.916C3.5 5.233 5.136 3.5 7.666 3.5H16.335C18.865 3.5 20.5 5.233 20.5 7.916V16.084C20.5 18.767 18.865 20.5 16.335 20.5H7.666ZM16.335 2H7.666C4.277 2 2 4.378 2 7.916V16.084C2 19.622 4.277 22 7.666 22H16.335C19.724 22 22 19.622 22 16.084V7.916C22 4.378 19.724 2 16.335 2Z"
      fill={color}
    />
    <Path
      d="M12 7.16418C11.586 7.16418 11.25 7.50018 11.25 7.91418V16.0862C11.25 16.5002 11.586 16.8362 12 16.8362C12.414 16.8362 12.75 16.5002 12.75 16.0862V7.91418C12.75 7.50018 12.414 7.16418 12 7.16418Z"
      fill={color}
    />
    <Path
      d="M12.0002 7.16298C11.8012 7.16298 11.6092 7.24198 11.4692 7.38398L7.72119 11.148C7.42819 11.442 7.43019 11.917 7.72319 12.209C8.01719 12.5 8.49119 12.502 8.78319 12.207L12.0002 8.97598L15.2172 12.207C15.5102 12.502 15.9842 12.5 16.2772 12.209C16.5702 11.917 16.5722 11.442 16.2792 11.148L12.5312 7.38398C12.3912 7.24198 12.1992 7.16298 12.0002 7.16298Z"
      fill={color}
    />
  </Svg>
);

export default ArrowUpSquareRegularLightOutlineIcon;
