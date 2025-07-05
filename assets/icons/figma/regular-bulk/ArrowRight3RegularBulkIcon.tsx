import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRight3RegularBulkIcon component
 */
export const ArrowRight3RegularBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M3.71101 11.3408H12.189C12.5812 11.3408 12.8995 11.6591 12.8995 12.0513C12.8995 12.4435 12.5812 12.7618 12.189 12.7618H3.71101C3.3188 12.7618 3.00049 12.4435 3.00049 12.0513C3.00049 11.6591 3.3188 11.3408 3.71101 11.3408Z"
      fill={color}
    />
    <Path d="M11.4785 17.4998V6.60336H20.418V17.4998H11.4785Z" fill={'white'} />
    <Path
      d="M12.189 6.60307C12.3217 6.60307 12.4524 6.64002 12.568 6.71202L20.0863 11.4498C20.2928 11.5805 20.4188 11.807 20.4188 12.0514C20.4188 12.2958 20.2928 12.5222 20.0863 12.653L12.568 17.3908C12.3491 17.5281 12.0725 17.5367 11.8461 17.4107C11.6187 17.2856 11.4785 17.0478 11.4785 16.7892V7.3136C11.4785 7.05497 11.6187 6.81718 11.8461 6.69213C11.9531 6.63244 12.0716 6.60307 12.189 6.60307Z"
      fill={color}
    />
  </Svg>
);

export default ArrowRight3RegularBulkIcon;
