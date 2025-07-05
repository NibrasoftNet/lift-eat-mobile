import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CameraSharpBoldIcon component
 */
export const CameraSharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M19.358 10.2392H17.858L17.849 8.73919H19.358V10.2392ZM12.249 16.6432C10.358 16.6432 8.819 15.1052 8.819 13.2142C8.819 11.3232 10.358 9.78519 12.249 9.78519C14.139 9.78519 15.677 11.3232 15.677 13.2142C15.677 15.1052 14.139 16.6432 12.249 16.6432ZM17.295 6.19819L15.563 3.49219H8.935L7.204 6.19819H2.5V20.5082H22V6.19819H17.295Z"
      fill={color}
    />
  </Svg>
);

export default CameraSharpBoldIcon;
