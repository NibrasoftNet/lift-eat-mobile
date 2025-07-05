import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * EditSharpBoldIcon component
 */
export const EditSharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M21.8535 8.48393L16.2475 2.87793L2.64648 16.4789L2.65148 22.0799H2.65748V22.3289L21.2185 22.3299V20.8299H9.50748L21.8535 8.48393Z"
      fill={color}
    />
  </Svg>
);

export default EditSharpBoldIcon;
