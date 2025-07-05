import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CalendarSharpLightBorderIcon component
 */
export const CalendarSharpLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M12.2543 17.3412H12.2628"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.14097 17.3412H8.14954"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.3587 17.3412H16.3673"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.2543 13.7464H12.2628"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.14097 13.7464H8.14954"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.3587 13.7459H16.3673"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M4.01074 10.1336H20.498"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.991 3.28467V6.32865"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.51831 3.28467V6.32865"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M20.5758 4.74512H3.92578V21.7844H20.5758V4.74512Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default CalendarSharpLightBorderIcon;
