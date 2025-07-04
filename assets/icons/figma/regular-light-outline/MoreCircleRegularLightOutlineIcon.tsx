import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * MoreCircleRegularLightOutlineIcon component
 */
export const MoreCircleRegularLightOutlineIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 3.5C7.313 3.5 3.5 7.313 3.5 12C3.5 16.687 7.313 20.5 12 20.5C16.687 20.5 20.5 16.687 20.5 12C20.5 7.313 16.687 3.5 12 3.5ZM12 22C6.486 22 2 17.514 2 12C2 6.486 6.486 2 12 2C17.514 2 22 6.486 22 12C22 17.514 17.514 22 12 22Z"
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

export default MoreCircleRegularLightOutlineIcon;
