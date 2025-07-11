import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ImageSharpBoldIcon component
 */
export const ImageSharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M18.888 19.032L18.742 19.064H5.921L5.749 18.792L8.162 14.324L8.541 14.351L11.693 15.94L14.656 12.007H15.018L19.069 18.802L18.888 19.032ZM8.757 6.545C9.954 6.547 10.928 7.521 10.928 8.716C10.928 9.912 9.954 10.886 8.757 10.886C7.561 10.886 6.587 9.912 6.587 8.716C6.587 7.518 7.561 6.545 8.757 6.545ZM2.5 22.354H22V2.854H2.5V22.354Z"
      fill={color}
    />
  </Svg>
);

export default ImageSharpBoldIcon;
