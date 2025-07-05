import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRightCircleRegularBulkIcon component
 */
export const ArrowRightCircleRegularBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 1.99976C17.515 1.99976 22 6.48576 22 11.9998C22 17.5138 17.515 21.9998 12 21.9998C6.486 21.9998 2 17.5138 2 11.9998C2 6.48576 6.486 1.99976 12 1.99976Z"
      fill={color}
    />
    <Path
      d="M10.5575 7.77905C10.7485 7.77905 10.9405 7.85205 11.0865 7.99805L14.5735 11.4681C14.7145 11.6091 14.7935 11.8001 14.7935 12.0001C14.7935 12.1991 14.7145 12.3901 14.5735 12.5311L11.0865 16.0031C10.7935 16.2951 10.3195 16.2951 10.0265 16.0011C9.73448 15.7071 9.73548 15.2321 10.0285 14.9401L12.9815 12.0001L10.0285 9.06005C9.73548 8.76805 9.73448 8.29405 10.0265 8.00005C10.1725 7.85205 10.3655 7.77905 10.5575 7.77905Z"
      fill={color}
    />
  </Svg>
);

export default ArrowRightCircleRegularBulkIcon;
