import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CategorySharpBoldIcon component
 */
export const CategorySharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path d="M2.30078 10.9504H10.3008V2.95039H2.30078V10.9504Z" fill={color} />
    <Path
      d="M22.1997 4.12129L14.4717 2.05029L12.4017 9.77829L20.1287 11.8483L22.1997 4.12129Z"
      fill={color}
    />
    <Path d="M2.30078 21.9494H10.3008V13.9494H2.30078V21.9494Z" fill={color} />
    <Path d="M13.3008 21.9494H21.3008V13.9494H13.3008V21.9494Z" fill={color} />
  </Svg>
);

export default CategorySharpBoldIcon;
