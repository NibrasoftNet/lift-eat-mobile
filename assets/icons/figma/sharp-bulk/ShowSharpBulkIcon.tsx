import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ShowSharpBulkIcon component
 */
export const ShowSharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M22.4035 13.8962C20.2695 9.40519 16.4745 6.72319 12.2525 6.72119H12.2485C8.02548 6.72319 4.23048 9.40519 2.09648 13.8962L1.66748 14.7992L3.47448 15.6582L3.90348 14.7542C5.69748 10.9772 8.81748 8.72219 12.2505 8.72119C15.6825 8.72219 18.8025 10.9772 20.5965 14.7542L21.0265 15.6582L22.8325 14.7992L22.4035 13.8962Z"
      fill={color}
    />
    <Path
      d="M12.2489 10.6641C10.2299 10.6641 8.58789 12.3071 8.58789 14.3261C8.58789 16.3451 10.2299 17.9871 12.2489 17.9871C14.2679 17.9871 15.9109 16.3451 15.9109 14.3261C15.9109 12.3071 14.2679 10.6641 12.2489 10.6641Z"
      fill={color}
    />
  </Svg>
);

export default ShowSharpBulkIcon;
