import * as React from 'react';
import Svg, { SvgProps, Path, Circle } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ProfileSharpLightBorderIcon component
 */
export const ProfileSharpLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.2499 14.8189C15.5063 14.8106 18.2751 16.3057 19.2928 19.5242C17.2414 20.7748 14.8268 21.2564 12.2499 21.2501C9.67304 21.2564 7.2584 20.7748 5.20703 19.5242C6.22593 16.3022 8.99006 14.8105 12.2499 14.8189Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Circle cx="12.2498" cy="7.16973" r="4.41973" fill='none' stroke={color} />
  </Svg>
);

export default ProfileSharpLightBorderIcon;
