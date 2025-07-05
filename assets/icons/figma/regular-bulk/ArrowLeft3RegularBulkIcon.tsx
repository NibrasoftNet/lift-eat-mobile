import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeft3RegularBulkIcon component
 */
export const ArrowLeft3RegularBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M20.289 12.6592L11.811 12.6592C11.4188 12.6592 11.1005 12.3409 11.1005 11.9487C11.1005 11.5565 11.4188 11.2382 11.811 11.2382L20.289 11.2382C20.6812 11.2382 20.9995 11.5565 20.9995 11.9487C20.9995 12.3409 20.6812 12.6592 20.289 12.6592Z"
      fill={color}
    />
    <Path
      d="M12.5215 6.50024L12.5215 17.3966H3.58202L3.58202 6.50024L12.5215 6.50024Z"
      fill={'white'}
    />
    <Path
      d="M11.811 17.3969C11.6783 17.3969 11.5476 17.36 11.432 17.288L3.9137 12.5502C3.70717 12.4195 3.58117 12.193 3.58117 11.9486C3.58117 11.7042 3.70717 11.4778 3.9137 11.347L11.432 6.60924C11.6509 6.47187 11.9275 6.46335 12.1539 6.58935C12.3813 6.7144 12.5215 6.95219 12.5215 7.21082L12.5215 16.6864C12.5215 16.945 12.3813 17.1828 12.1539 17.3079C12.0469 17.3676 11.9284 17.3969 11.811 17.3969Z"
      fill={color}
    />
  </Svg>
);

export default ArrowLeft3RegularBulkIcon;
