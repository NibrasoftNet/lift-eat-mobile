import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DangerTriangleSharpBoldIcon component
 */
export const DangerTriangleSharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M13.0153 18.0881H11.5153L11.5063 16.5881H13.0153V18.0881ZM11.5133 15.3011H13.0133V11.0001H11.5133V15.3011ZM12.6132 3.74414H11.8842L2.40625 20.3731L3.06225 21.3251H21.3803L22.0933 20.3871L12.6132 3.74414Z"
      fill={color}
    />
  </Svg>
);

export default DangerTriangleSharpBoldIcon;
