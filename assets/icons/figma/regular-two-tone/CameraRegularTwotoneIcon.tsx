import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CameraRegularTwotoneIcon component
 */
export const CameraRegularTwotoneIcon = ({
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
      d="M17.4955 9.69995H17.5045"
      fill='none'
      stroke={color}
      strokeWidth="2"
    />
    <Path
      d="M15.1788 13.3279C15.1788 11.5719 13.7558 10.1489 11.9998 10.1489C10.2438 10.1489 8.8208 11.5719 8.8208 13.3279C8.8208 15.0839 10.2438 16.5069 11.9998 16.5069C13.7558 16.5069 15.1788 15.0839 15.1788 13.3279Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default CameraRegularTwotoneIcon;
