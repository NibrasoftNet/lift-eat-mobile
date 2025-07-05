import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * TimeCircleSharpBulkIcon component
 */
export const TimeCircleSharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.25 2.25C6.874 2.25 2.5 6.624 2.5 12C2.5 17.376 6.874 21.75 12.25 21.75C17.626 21.75 22 17.376 22 12C22 6.624 17.626 2.25 12.25 2.25Z"
      fill={color}
    />
    <Path
      d="M11.1621 13.1182L15.9421 15.9702L16.7111 14.6822L12.6621 12.2672V7.09619H11.1621V13.1182Z"
      fill={color}
    />
  </Svg>
);

export default TimeCircleSharpBulkIcon;
