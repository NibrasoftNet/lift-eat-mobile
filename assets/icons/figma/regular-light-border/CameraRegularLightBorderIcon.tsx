import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CameraRegularLightBorderIcon component
 */
export const CameraRegularLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M15.04 4.05126C16.05 4.45326 16.359 5.85326 16.772 6.30326C17.185 6.75326 17.776 6.90626 18.103 6.90626C19.841 6.90626 21.25 8.31526 21.25 10.0523V15.8473C21.25 18.1773 19.36 20.0673 17.03 20.0673H6.97C4.639 20.0673 2.75 18.1773 2.75 15.8473V10.0523C2.75 8.31526 4.159 6.90626 5.897 6.90626C6.223 6.90626 6.814 6.75326 7.228 6.30326C7.641 5.85326 7.949 4.45326 8.959 4.05126C9.97 3.64926 14.03 3.64926 15.04 4.05126Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.1788 13.128C15.1788 11.372 13.7558 9.94897 11.9998 9.94897C10.2438 9.94897 8.8208 11.372 8.8208 13.128C8.8208 14.884 10.2438 16.307 11.9998 16.307C13.7558 16.307 15.1788 14.884 15.1788 13.128Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path d="M17.4955 9.5H17.5045" fill='none' stroke={color} strokeWidth="2" />
  </Svg>
);

export default CameraRegularLightBorderIcon;
