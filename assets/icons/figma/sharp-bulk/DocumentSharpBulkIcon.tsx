import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DocumentSharpBulkIcon component
 */
export const DocumentSharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path d="M3.37646 21.75H21.1235V2.25H3.37646V21.75Z" fill={color} />
    <Path d="M15.4416 9.979H7.87158V8.479H15.4416V9.979Z" fill={color} />
    <Path d="M11.6876 14.143H7.87158V12.643H11.6876V14.143Z" fill={color} />
  </Svg>
);

export default DocumentSharpBulkIcon;
