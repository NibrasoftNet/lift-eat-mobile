import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * WorkSharpLightBorderIcon component
 */
export const WorkSharpLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.25 17.2265V14.6895"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M3.0293 15.1934L3.2183 20.7004H21.2813L21.4703 15.1934"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M21.4949 5.87988V12.3799C19.0349 13.8199 15.7849 14.6899 12.2449 14.6899C8.70488 14.6899 5.46488 13.8199 3.00488 12.3799V5.87988H21.4949Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.75 5.61115L14.7501 3.2998H9.7501L8.75 5.61115"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default WorkSharpLightBorderIcon;
