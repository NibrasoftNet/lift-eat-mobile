import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * MoreSquareRegularLightOutlineIcon component
 */
export const MoreSquareRegularLightOutlineIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M7.665 3.5C5.135 3.5 3.5 5.233 3.5 7.916V16.084C3.5 18.767 5.135 20.5 7.665 20.5H16.333C18.864 20.5 20.5 18.767 20.5 16.084V7.916C20.5 5.233 18.864 3.5 16.334 3.5H7.665ZM16.333 22H7.665C4.276 22 2 19.622 2 16.084V7.916C2 4.378 4.276 2 7.665 2H16.334C19.723 2 22 4.378 22 7.916V16.084C22 19.622 19.723 22 16.333 22Z"
      fill={color}
    />
    <Path
      d="M15.9484 13.0137C15.3954 13.0137 14.9434 12.5667 14.9434 12.0137C14.9434 11.4607 15.3864 11.0137 15.9384 11.0137H15.9484C16.5014 11.0137 16.9484 11.4607 16.9484 12.0137C16.9484 12.5667 16.5014 13.0137 15.9484 13.0137Z"
      fill={color}
    />
    <Path
      d="M11.9386 13.0137C11.3856 13.0137 10.9346 12.5667 10.9346 12.0137C10.9346 11.4607 11.3766 11.0137 11.9296 11.0137H11.9386C12.4916 11.0137 12.9386 11.4607 12.9386 12.0137C12.9386 12.5667 12.4916 13.0137 11.9386 13.0137Z"
      fill={color}
    />
    <Path
      d="M7.9298 13.0137C7.3768 13.0137 6.9248 12.5667 6.9248 12.0137C6.9248 11.4607 7.3678 11.0137 7.9208 11.0137H7.9298C8.4828 11.0137 8.9298 11.4607 8.9298 12.0137C8.9298 12.5667 8.4828 13.0137 7.9298 13.0137Z"
      fill={color}
    />
  </Svg>
);

export default MoreSquareRegularLightOutlineIcon;
