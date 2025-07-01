import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CloseSquareSharpLightBorderIcon component
 */
export const CloseSquareSharpLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M14.6455 10.1294L9.85352 14.9214" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M14.6456 14.9244L9.84961 10.1274" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M12.25 21.7847C17.3586 21.7847 21.5 17.6433 21.5 12.5347C21.5 7.42603 17.3586 3.28467 12.25 3.28467C7.14137 3.28467 3 7.42603 3 12.5347C3 17.6433 7.14137 21.7847 12.25 21.7847Z" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default CloseSquareSharpLightBorderIcon;
