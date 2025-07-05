import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CallMissedCurvedLightBorderIcon component
 */
export const CallMissedCurvedLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M21.3281 2.75L15.3281 8.75"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.3281 2.75L21.3281 8.75"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M7.70098 16.299C0.802193 9.40023 1.78303 6.24116 2.51123 5.22211C2.60358 5.05863 4.90601 1.61189 7.3751 3.63408C13.5011 8.67946 5.74461 7.96612 10.8898 13.1113C16.0339 18.2554 15.3205 10.5 20.3659 16.6249C22.3881 19.094 18.9414 21.3954 18.7779 21.4888C17.7588 22.217 14.5998 23.1978 7.70098 16.299Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default CallMissedCurvedLightBorderIcon;
