import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Star3SharpBulkIcon component
 */
export const Star3SharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.2501 1.31006L9.36206 9.11306L1.56006 12.0001L9.36206 14.8871L12.2501 22.6901V1.31006Z"
      fill={color}
    />
    <Path
      d="M12.2499 1.31006L15.1379 9.11306L22.9399 12.0001L15.1379 14.8871L12.2499 22.6901V1.31006Z"
      fill={color}
    />
  </Svg>
);

export default Star3SharpBulkIcon;
