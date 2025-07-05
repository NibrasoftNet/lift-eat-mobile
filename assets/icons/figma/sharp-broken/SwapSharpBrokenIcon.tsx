import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * SwapSharpBrokenIcon component
 */
export const SwapSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M16.9004 20.1499V6.21094"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.3105 15.5547C14.6705 15.5547 16.9005 17.6357 16.9005 20.1507"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M21.5002 15.5548C20.7242 15.5548 19.9602 15.7798 19.2852 16.1718"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M3 8.44569C3.747 8.44569 4.483 8.23669 5.139 7.87169"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M7.60059 3.8501V17.7891"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.1906 8.44561C9.83059 8.44561 7.60059 6.36461 7.60059 3.84961"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default SwapSharpBrokenIcon;
