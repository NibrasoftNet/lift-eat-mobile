import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDown3RegularBulkIcon component
 */
export const ArrowDown3RegularBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M12.6588 3.71089V12.1889C12.6588 12.5811 12.3405 12.8994 11.9483 12.8994C11.5561 12.8994 11.2378 12.5811 11.2378 12.1889V3.71089C11.2378 3.31868 11.5561 3.00037 11.9483 3.00037C12.3405 3.00037 12.6588 3.31868 12.6588 3.71089Z" fill={color} />
    <Path d="M6.5 11.4785H17.3964V20.418H6.5V11.4785Z" fill={"white"} />
    <Path d="M17.3967 12.189C17.3967 12.3217 17.3597 12.4524 17.2877 12.568L12.5499 20.0863C12.4192 20.2928 12.1928 20.4188 11.9484 20.4188C11.7039 20.4188 11.4775 20.2928 11.3468 20.0863L6.609 12.568C6.47163 12.3491 6.4631 12.0725 6.5891 11.8461C6.71416 11.6187 6.95195 11.4785 7.21058 11.4785H16.6862C16.9448 11.4785 17.1826 11.6187 17.3076 11.8461C17.3673 11.9531 17.3967 12.0716 17.3967 12.189Z" fill={color} />
  </Svg>
);

export default ArrowDown3RegularBulkIcon;
