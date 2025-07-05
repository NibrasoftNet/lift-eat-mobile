import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * SettingSharpLightBorderIcon component
 */
export const SettingSharpLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.25 15.6876C14.2866 15.6876 15.9376 14.0366 15.9376 12C15.9376 9.96347 14.2866 8.3125 12.25 8.3125C10.2135 8.3125 8.5625 9.96347 8.5625 12C8.5625 14.0366 10.2135 15.6876 12.25 15.6876Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M19.0538 18.7156L18.6159 15.6753L21.4677 14.5345V9.46567L18.6169 8.32522L19.0549 5.28442L14.6652 2.75L12.2506 4.64979L9.8361 2.75L5.44636 5.28442L5.88427 8.32471L3.03223 9.46567V14.5345L5.88527 15.6759L5.44744 18.7156L9.83718 21.25L12.2506 19.3511L14.6641 21.25L19.0538 18.7156Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default SettingSharpLightBorderIcon;
