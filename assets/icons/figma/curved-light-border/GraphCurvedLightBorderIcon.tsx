import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * GraphCurvedLightBorderIcon component
 */
export const GraphCurvedLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M13.6785 3.34872C12.9705 4.16372 12.6885 9.28872 13.5115 10.1127C14.3345 10.9347 19.2795 10.5187 20.4675 9.58372C23.3255 7.33272 15.9385 0.746719 13.6785 3.34872Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M18.1377 13.7899C19.2217 14.8739 16.3477 21.0539 10.6517 21.0539C6.39771 21.0539 2.94971 17.6059 2.94971 13.3529C2.94971 8.05293 8.17871 4.66293 9.67771 6.16193C10.5407 7.02493 9.56871 11.0859 11.1167 12.6349C12.6647 14.1839 17.0537 12.7059 18.1377 13.7899Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default GraphCurvedLightBorderIcon;
