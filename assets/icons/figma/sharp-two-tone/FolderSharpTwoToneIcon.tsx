import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * FolderSharpTwoToneIcon component
 */
export const FolderSharpTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M7.88281 15.0864H16.6178"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M21.5 20.3264H3V3.67334H9.96326L12.2249 6.45227H21.5V20.3264Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default FolderSharpTwoToneIcon;
