import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * EditSharpBulkIcon component
 */
export const EditSharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M16.2475 2.87793L21.8535 8.48393L12.831 17.5064L12.8266 17.5059L7.98501 22.3292L2.65748 22.3289V22.0799H2.65148L2.64648 16.4789L16.2475 2.87793Z"
      fill={color}
    />
    <Path
      d="M7.98486 22.3289L21.2183 22.3296V20.8296H9.50734L7.98486 22.3289Z"
      fill={color}
    />
  </Svg>
);

export default EditSharpBulkIcon;
