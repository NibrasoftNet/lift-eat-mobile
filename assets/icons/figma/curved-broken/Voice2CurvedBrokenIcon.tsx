import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Voice2CurvedBrokenIcon component
 */
export const Voice2CurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M6.61426 13.5938C6.61426 16.5687 9.02526 18.9798 12.0013 18.9798C14.9753 18.9798 17.3863 16.5687 17.3863 13.5938"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.001 21.0245V18.9795"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M5.22266 13.5938H18.7777"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.46877 4.29297C7.33277 5.27997 6.61377 6.73597 6.61377 8.35997V10.501"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M17.386 10.5016V8.36061C17.386 5.38561 14.975 2.97461 12 2.97461"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M10.5078 10.2139H13.4928"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.5015 7.44336H11.4985"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default Voice2CurvedBrokenIcon;
