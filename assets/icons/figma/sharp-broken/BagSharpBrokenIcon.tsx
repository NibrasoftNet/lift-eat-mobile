import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * BagSharpBrokenIcon component
 */
export const BagSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M17 9.68424V8.57224C17 5.94924 14.873 3.82324 12.25 3.82324C9.62698 3.82324 7.50098 5.94924 7.50098 8.57224V9.68424"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M13.849 21.2465H20.437L21.5 7.89453H3L4.063 21.2465H8.469"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default BagSharpBrokenIcon;
