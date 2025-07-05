import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Star7SharpTwoToneIcon component
 */
export const Star7SharpTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M19.2251 12.9735L21.5 12L16.9502 10.0531L18.7907 5.45926L14.1969 7.29976L12.25 2.75L10.3031 7.29976L5.70926 5.45926L7.54976 10.0531L3 12L5.27488 12.9735"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M19.2251 12.9736L16.9503 13.9471L18.7908 18.5409L14.1969 16.7004L12.25 21.2502L10.3031 16.7004L5.70928 18.5409L7.54978 13.9471L5.2749 12.9736"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default Star7SharpTwoToneIcon;
