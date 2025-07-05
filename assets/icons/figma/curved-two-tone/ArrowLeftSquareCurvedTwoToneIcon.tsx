import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeftSquareCurvedTwoToneIcon component
 */
export const ArrowLeftSquareCurvedTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M7.91394 12L16.0859 12"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M11.6782 15.752C11.6782 15.752 7.91422 13.224 7.91422 12C7.91422 10.776 11.6782 8.25195 11.6782 8.25195"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12 2.75C5.063 2.75 2.75 5.063 2.75 12C2.75 18.937 5.063 21.25 12 21.25C18.937 21.25 21.25 18.937 21.25 12C21.25 5.063 18.937 2.75 12 2.75Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowLeftSquareCurvedTwoToneIcon;
