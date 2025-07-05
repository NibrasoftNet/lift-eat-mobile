import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DocumentCurvedTwoToneIcon component
 */
export const DocumentCurvedTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M15.5955 15.6963H8.37549"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.5955 11.9365H8.37549"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M11.131 8.17676H8.37598"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M3.60986 12C3.60986 18.937 5.70786 21.25 12.0009 21.25C18.2949 21.25 20.3919 18.937 20.3919 12C20.3919 5.063 18.2949 2.75 12.0009 2.75C5.70786 2.75 3.60986 5.063 3.60986 12Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default DocumentCurvedTwoToneIcon;
