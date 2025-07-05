import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ShieldDoneSharpBulkIcon component
 */
export const ShieldDoneSharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M3.88184 3.09277V12.6428C3.88184 19.5028 12.0238 22.0468 12.1058 22.0718L12.2508 22.1158L12.3958 22.0718C12.4778 22.0468 20.6178 19.5028 20.6178 12.6428V3.09277H3.88184Z"
      fill={color}
    />
    <Path
      d="M8.57617 11.2876L11.5282 14.2446L16.4872 9.28363L15.4262 8.22363L11.5292 12.1226L9.63817 10.2276L8.57617 11.2876Z"
      fill={color}
    />
  </Svg>
);

export default ShieldDoneSharpBulkIcon;
