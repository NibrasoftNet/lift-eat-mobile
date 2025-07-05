import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * EditCurvedTwoToneIcon component
 */
export const EditCurvedTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M13.3354 19.5078H19.7124"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.058 4.85877V4.85877C14.714 3.85077 12.808 4.12277 11.8 5.46577C11.8 5.46577 6.78704 12.1438 5.04804 14.4608C3.30904 16.7788 4.95404 19.6508 4.95404 19.6508C4.95404 19.6508 8.19804 20.3968 9.91204 18.1118C11.627 15.8278 16.664 9.11677 16.664 9.11677C17.672 7.77377 17.401 5.86677 16.058 4.85877Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M10.5044 7.21094L15.3684 10.8619"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default EditCurvedTwoToneIcon;
