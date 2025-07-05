import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDownSharpBulkIcon component
 */
export const ArrowDownSharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path d="M13.25 3.29102V19.6913H11.25V3.29102H13.25Z" fill={color} />
    <Path
      d="M6.22866 11.8271L12.2507 17.8741L18.2717 11.8271L19.6889 13.2383L12.2508 20.7086L4.81152 13.2384L6.22866 11.8271Z"
      fill={color}
    />
  </Svg>
);

export default ArrowDownSharpBulkIcon;
