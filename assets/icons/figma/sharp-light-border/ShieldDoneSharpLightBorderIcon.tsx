import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ShieldDoneSharpLightBorderIcon component
 */
export const ShieldDoneSharpLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M9.63672 11.2999L11.5287 13.1949L15.4267 9.29492"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.2506 21.604C12.2506 21.604 20.1185 19.2217 20.1185 12.6543V3.604H4.38281V12.6543C4.38281 19.2217 12.2506 21.604 12.2506 21.604Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ShieldDoneSharpLightBorderIcon;
