import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * BagSharpTwoToneIcon component
 */
export const BagSharpTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M16.9996 9.68444V8.57254C16.9996 5.94958 14.8732 3.82324 12.2503 3.82324C9.62731 3.82324 7.50098 5.94958 7.50098 8.57254V9.68444"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M20.4369 21.2461L21.5 7.89355L3 7.89355L4.06307 21.2461L20.4369 21.2461Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default BagSharpTwoToneIcon;
