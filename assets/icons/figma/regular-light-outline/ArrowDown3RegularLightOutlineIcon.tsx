import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDown3RegularLightOutlineIcon component
 */
export const ArrowDown3RegularLightOutlineIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M11.751 13.4502C11.337 13.4502 11.001 13.1142 11.001 12.7002V3.75024C11.001 3.33624 11.337 3.00024 11.751 3.00024C12.165 3.00024 12.501 3.33624 12.501 3.75024V12.7002C12.501 13.1142 12.165 13.4502 11.751 13.4502Z"
      fill={color}
    />
    <Path d="M6 11.9502H17.502V21.3867H6V11.9502Z" fill={'white'} />
    <Path
      d="M8.10955 13.4502L11.7516 19.2292L15.3926 13.4502H8.10955ZM11.7516 21.3872C11.4936 21.3872 11.2546 21.2552 11.1166 21.0362L6.11555 13.0992C5.96955 12.8692 5.96155 12.5772 6.09355 12.3382C6.22555 12.0982 6.47655 11.9502 6.75055 11.9502H16.7526C17.0256 11.9502 17.2766 12.0982 17.4086 12.3382C17.5416 12.5772 17.5326 12.8692 17.3866 13.0992L12.3856 21.0362C12.2486 21.2552 12.0086 21.3872 11.7516 21.3872Z"
      fill={color}
    />
  </Svg>
);

export default ArrowDown3RegularLightOutlineIcon;
