import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CloseSquareSharpBrokenIcon component
 */
export const CloseSquareSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M14.6501 10.1289L9.8501 14.9209"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M14.6501 14.924L9.8501 10.127"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M17.202 20.3487C19.786 18.7077 21.5 15.8217 21.5 12.5347C21.5 7.42567 17.36 3.28467 12.25 3.28467C7.14 3.28467 3 7.42567 3 12.5347C3 17.6427 7.14 21.7847 12.25 21.7847"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default CloseSquareSharpBrokenIcon;
