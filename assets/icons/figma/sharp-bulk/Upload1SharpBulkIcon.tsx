import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Upload1SharpBulkIcon component
 */
export const Upload1SharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path d="M2.5 10.4897V22.0097H22V10.4897H2.5Z" fill={color} />
    <Path
      d="M12.9999 4.2852L15.5279 6.8212L16.5909 5.7622L12.2489 1.4082L7.91992 5.7642L8.98292 6.8212L11.4999 4.2892V16.7006H12.9999V4.2852Z"
      fill={color}
    />
  </Svg>
);

export default Upload1SharpBulkIcon;
