import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DiscountSharpTwoToneIcon component
 */
export const DiscountSharpTwoToneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M9.9082 14.669L14.3828 10.1943" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M14.3161 14.6062H14.324" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M9.96456 10.2536H9.97239" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M12.25 3.28467C13.7806 5.30323 16.2811 6.33899 18.7907 5.99393C18.4457 8.50355 19.4814 11.0041 21.5 12.5347C19.4814 14.0652 18.4457 16.5658 18.7907 19.0754C16.2811 18.7303 13.7806 19.7661 12.25 21.7847C10.7194 19.7661 8.21888 18.7303 5.70926 19.0754C6.05432 16.5658 5.01856 14.0652 3 12.5347C5.01856 11.0041 6.05432 8.50355 5.70926 5.99393C8.21888 6.33899 10.7194 5.30323 12.25 3.28467Z" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default DiscountSharpTwoToneIcon;
