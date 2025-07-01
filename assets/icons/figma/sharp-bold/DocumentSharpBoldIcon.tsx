import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DocumentSharpBoldIcon component
 */
export const DocumentSharpBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M7.87146 9.979H15.4415V8.479H7.87146V9.979ZM7.87146 14.143H11.6875V12.643H7.87146V14.143ZM3.37646 21.75H21.1235V2.25H3.37646V21.75Z" fill={color} />
  </Svg>
);

export default DocumentSharpBoldIcon;
