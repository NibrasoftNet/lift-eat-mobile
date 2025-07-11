import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DiscountCurvedBulkIcon component
 */
export const DiscountCurvedBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M12.25 2.78516C5.052 2.78516 2.5 5.33716 2.5 12.5352C2.5 19.7332 5.052 22.2852 12.25 22.2852C19.449 22.2852 22 19.7332 22 12.5352C22 5.33716 19.449 2.78516 12.25 2.78516Z"
      fill={color}
    />
    <Path
      d="M10.2094 15.6366L15.3504 10.4956C15.6434 10.2026 15.6434 9.72759 15.3504 9.43459C15.0574 9.14159 14.5824 9.14159 14.2894 9.43459L9.14944 14.5756C8.85644 14.8686 8.85644 15.3436 9.14944 15.6366C9.29544 15.7826 9.48744 15.8556 9.67944 15.8556C9.87144 15.8556 10.0634 15.7826 10.2094 15.6366Z"
      fill={color}
    />
    <Path
      d="M13.9984 15.0356C13.9984 15.4496 14.3394 15.7856 14.7534 15.7856C15.1674 15.7856 15.5034 15.4496 15.5034 15.0356C15.5034 14.6216 15.1674 14.2856 14.7534 14.2856H14.7454C14.3304 14.2856 13.9984 14.6216 13.9984 15.0356Z"
      fill={color}
    />
    <Path
      d="M9.75344 9.28559H9.74544C9.33044 9.28559 8.99844 9.62159 8.99844 10.0356C8.99844 10.4496 9.33944 10.7856 9.75344 10.7856C10.1674 10.7856 10.5034 10.4496 10.5034 10.0356C10.5034 9.62159 10.1674 9.28559 9.75344 9.28559Z"
      fill={color}
    />
  </Svg>
);

export default DiscountCurvedBulkIcon;
