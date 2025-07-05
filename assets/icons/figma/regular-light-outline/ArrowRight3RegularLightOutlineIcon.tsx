import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRight3RegularLightOutlineIcon component
 */
export const ArrowRight3RegularLightOutlineIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12.7 13.5005H3.75C3.336 13.5005 3 13.1645 3 12.7505C3 12.3365 3.336 12.0005 3.75 12.0005H12.7C13.114 12.0005 13.45 12.3365 13.45 12.7505C13.45 13.1645 13.114 13.5005 12.7 13.5005Z"
      fill={color}
    />
    <Path
      d="M11.9502 7.00049H21.3872V18.5015H11.9502V7.00049Z"
      fill={'white'}
    />
    <Path
      d="M13.4502 9.10881V16.3918L19.2302 12.7508L13.4502 9.10881ZM12.7002 18.5018C12.5752 18.5018 12.4512 18.4698 12.3382 18.4078C12.0982 18.2758 11.9502 18.0248 11.9502 17.7518V7.74981C11.9502 7.47581 12.0982 7.22481 12.3382 7.09281C12.5772 6.96181 12.8702 6.96981 13.0992 7.11481L21.0372 12.1158C21.2562 12.2538 21.3872 12.4928 21.3872 12.7508C21.3872 13.0078 21.2562 13.2478 21.0372 13.3848L13.0992 18.3858C12.9782 18.4628 12.8392 18.5018 12.7002 18.5018Z"
      fill={color}
    />
  </Svg>
);

export default ArrowRight3RegularLightOutlineIcon;
