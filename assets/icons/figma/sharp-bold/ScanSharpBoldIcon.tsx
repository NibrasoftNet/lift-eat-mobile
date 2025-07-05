import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ScanSharpBoldIcon component
 */
export const ScanSharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M1.5 12.6625V14.0725H3.28V21.5025H9.51V20.0025H4.78V14.0725H6.8V18.0825H17.95V14.0725H19.72V20.0025H15.02V21.5025H21.22V14.0725H23V12.6625H1.5Z"
      fill={color}
    />
    <Path
      d="M19.7183 10.0626H21.2183V3.56759H15.0153V5.06759H19.7183V10.0626Z"
      fill={color}
    />
    <Path
      d="M4.7812 5.06738H9.5132V3.56738H3.2812V10.0624H4.7812V5.06738Z"
      fill={color}
    />
    <Path d="M6.8 11.1625H17.95V6.92249H6.8V11.1625Z" fill={color} />
  </Svg>
);

export default ScanSharpBoldIcon;
