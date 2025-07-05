import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * FolderSharpBulkIcon component
 */
export const FolderSharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.46 5.94992L10.2 3.16992H2.5V20.8299H22V5.94992H12.46Z"
      fill={color}
    />
    <Path d="M17.3699 15.8398H7.12988V14.3398H17.3699V15.8398Z" fill={color} />
  </Svg>
);

export default FolderSharpBulkIcon;
