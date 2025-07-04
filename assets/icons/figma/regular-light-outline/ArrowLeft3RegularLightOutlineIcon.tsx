import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeft3RegularLightOutlineIcon component
 */
export const ArrowLeft3RegularLightOutlineIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M12.3 13.5005H21.25C21.664 13.5005 22 13.1645 22 12.7505C22 12.3365 21.664 12.0005 21.25 12.0005H12.3C11.886 12.0005 11.55 12.3365 11.55 12.7505C11.55 13.1645 11.886 13.5005 12.3 13.5005Z" fill={color} />
    <Path d="M13.0498 7.00049H3.6128V18.5015H13.0498V7.00049Z" fill={"white"} />
    <Path d="M11.5498 9.10881V16.3918L5.7698 12.7508L11.5498 9.10881ZM12.2998 18.5018C12.4248 18.5018 12.5488 18.4698 12.6618 18.4078C12.9018 18.2758 13.0498 18.0248 13.0498 17.7518V7.74981C13.0498 7.47581 12.9018 7.22481 12.6618 7.09281C12.4228 6.96181 12.1298 6.96981 11.9008 7.11481L3.9628 12.1158C3.7438 12.2538 3.6128 12.4928 3.6128 12.7508C3.6128 13.0078 3.7438 13.2478 3.9628 13.3848L11.9008 18.3858C12.0218 18.4628 12.1608 18.5018 12.2998 18.5018Z" fill={color} />
  </Svg>
);

export default ArrowLeft3RegularLightOutlineIcon;
