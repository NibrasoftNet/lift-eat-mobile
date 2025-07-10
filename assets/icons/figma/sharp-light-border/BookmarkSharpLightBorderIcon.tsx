import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * BookmarkSharpLightBorderIcon component
 */
export const BookmarkSharpLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M19.7276 2.75C13.8873 2.75 10.6128 2.75 4.77246 2.75V21.25L12.2751 17.8045L19.7276 21.25V2.75Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.72852 9.2251H15.7719"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default BookmarkSharpLightBorderIcon;
