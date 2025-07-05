import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * WalletCurvedLightBorderIcon component
 */
export const WalletCurvedLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M21.1707 14.6755H17.284C15.8688 14.6755 14.7212 13.5279 14.7212 12.1117C14.7212 10.6964 15.8688 9.54883 17.284 9.54883H21.1402"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M17.7219 12.0533H17.4248"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M7.60596 8.14318H11.666"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M2.71387 12.2529C2.71387 5.84815 5.03863 3.71387 12.0148 3.71387C18.9901 3.71387 21.3148 5.84815 21.3148 12.2529C21.3148 18.6567 18.9901 20.792 12.0148 20.792C5.03863 20.792 2.71387 18.6567 2.71387 12.2529Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default WalletCurvedLightBorderIcon;
