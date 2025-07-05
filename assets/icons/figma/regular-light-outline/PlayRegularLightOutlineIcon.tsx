import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PlayRegularLightOutlineIcon component
 */
export const PlayRegularLightOutlineIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12.25 3.5C7.425 3.5 3.5 7.425 3.5 12.25C3.5 17.075 7.425 21 12.25 21C17.075 21 21 17.075 21 12.25C21 7.425 17.075 3.5 12.25 3.5ZM12.25 22.5C6.598 22.5 2 17.902 2 12.25C2 6.598 6.598 2 12.25 2C17.902 2 22.5 6.598 22.5 12.25C22.5 17.902 17.902 22.5 12.25 22.5Z"
      fill={color}
    />
    <Path
      d="M11.134 10.0865C10.957 11.0875 10.954 13.4785 11.131 14.4285C12.009 14.1185 13.911 12.8685 14.423 12.2495C13.913 11.6485 12.035 10.4245 11.134 10.0865ZM10.828 16.0015C10.558 16.0015 10.302 15.9245 10.093 15.7165C9.932 15.5575 9.502 15.1325 9.5 12.3335C9.499 9.36151 9.946 8.91951 10.093 8.77251C10.616 8.25451 11.468 8.60951 11.831 8.76151C12.351 8.97851 16 10.8475 16 12.2455C16 13.5555 12.716 15.3875 11.877 15.7375C11.55 15.8735 11.177 16.0015 10.828 16.0015Z"
      fill={color}
    />
  </Svg>
);

export default PlayRegularLightOutlineIcon;
