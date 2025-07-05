import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * FolderSharpBoldIcon component
 */
export const FolderSharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M7.13 15.8399H17.37V14.3399H7.13V15.8399ZM12.46 5.94992L10.2 3.16992H2.5V20.8299H22V5.94992H12.46Z"
      fill={color}
    />
  </Svg>
);

export default FolderSharpBoldIcon;
