import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Star6SharpBulkIcon component
 */
export const Star6SharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.2501 0.930664L10.1331 8.33766L2.66113 6.46366L8.02413 12.0007L2.66113 17.5367L10.1331 15.6627L12.2501 23.0697V0.930664Z"
      fill={color}
    />
    <Path
      d="M12.2499 0.930664L14.3669 8.33766L21.8389 6.46366L16.4759 12.0007L21.8389 17.5367L14.3669 15.6627L12.2499 23.0697V0.930664Z"
      fill={color}
    />
  </Svg>
);

export default Star6SharpBulkIcon;
