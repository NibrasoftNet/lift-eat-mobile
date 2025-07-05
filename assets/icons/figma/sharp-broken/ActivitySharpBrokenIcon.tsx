import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ActivitySharpBrokenIcon component
 */
export const ActivitySharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M7.46631 15.2541L10.2713 11.6081L13.4723 14.1221L16.2173 10.5781"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M7.10107 21.5345H20.4911V10.1235"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M14.6653 4.32373H3.28027V21.5347"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M19.4177 3.53418C20.4127 3.53418 21.2197 4.34118 21.2197 5.33618C21.2197 6.33118 20.4127 7.13718 19.4177 7.13718C18.4227 7.13718 17.6157 6.33118 17.6157 5.33618C17.6157 4.34118 18.4227 3.53418 19.4177 3.53418Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ActivitySharpBrokenIcon;
