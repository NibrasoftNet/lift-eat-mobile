import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * EditSquareCurvedBoldIcon component
 */
export const EditSquareCurvedBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M17.02 10.714L16.46 11.344C16.44 11.314 13 8.264 12.96 8.244L13.52 7.614C14.38 6.654 15.86 6.564 16.82 7.414C17.34 7.874 17.61 8.524 17.61 9.164C17.61 9.714 17.42 10.264 17.02 10.714ZM11.6 16.844C10.86 17.674 9.86 17.874 9.07 17.874C8.35 17.874 7.79 17.704 7.78 17.704C7.75 17.694 7.72 17.664 7.71 17.634C7.7 17.614 6.67 15.364 8.1 13.744L11.98 9.354C12.01 9.384 15.45 12.434 15.48 12.454L11.6 16.844ZM12.25 2.854C5.05 2.854 2.5 5.404 2.5 12.604C2.5 19.804 5.05 22.354 12.25 22.354C19.45 22.354 22 19.804 22 12.604C22 5.404 19.45 2.854 12.25 2.854Z"
      fill={color}
    />
  </Svg>
);

export default EditSquareCurvedBoldIcon;
