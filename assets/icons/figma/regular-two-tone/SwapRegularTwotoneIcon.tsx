import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * SwapRegularTwotoneIcon component
 */
export const SwapRegularTwotoneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M16.8397 20.1642V6.54639"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M20.9173 16.0681L16.8395 20.1648L12.7617 16.0681"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M6.91102 3.83276V17.4505"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M2.8335 7.92894L6.91127 3.83228L10.9891 7.92894"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default SwapRegularTwotoneIcon;
