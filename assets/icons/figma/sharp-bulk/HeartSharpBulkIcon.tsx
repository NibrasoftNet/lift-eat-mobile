import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * HeartSharpBulkIcon component
 */
export const HeartSharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.251 20.9083L12.25 4.9542C13.6841 3.25791 15.595 2.69395 17.6912 3.37119C20.3372 4.22325 21.988 6.61436 22 9.60996C22.0251 14.7442 17.0862 18.7662 12.4541 20.818L12.251 20.9083Z"
      fill={color}
    />
    <Path
      d="M12.249 20.9083L12.25 4.9542C10.8159 3.25791 8.90503 2.69395 6.80884 3.37119C4.16284 4.22325 2.51196 6.61436 2.5 9.60996C2.47485 14.7442 7.41382 18.7662 12.0459 20.818L12.249 20.9083Z"
      fill={color}
    />
  </Svg>
);

export default HeartSharpBulkIcon;
