import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * UploadSharpTwoToneIcon component
 */
export const UploadSharpTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M16.875 11.3394L21.5 11.3394L21.5 21.8633L3 21.8633L3 11.3394L7.625 11.3394"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M7.65547 7.00977C10.0179 7.00977 12.251 4.92916 12.251 2.41426"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.251 2.41406L12.251 16.3533"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.8465 7.00977C14.484 7.00977 12.251 4.92916 12.251 2.41426"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default UploadSharpTwoToneIcon;
