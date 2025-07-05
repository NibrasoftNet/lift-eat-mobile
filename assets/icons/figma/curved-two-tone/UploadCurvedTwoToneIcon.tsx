import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * UploadCurvedTwoToneIcon component
 */
export const UploadCurvedTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M7.63 7.64062C4.05 7.97063 2.75 9.31063 2.75 14.6406C2.75 21.7416 5.06 21.7416 12 21.7416C18.94 21.7416 21.25 21.7416 21.25 14.6406C21.25 9.31063 19.95 7.97063 16.37 7.64063"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.1211 2.209V14.25"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M9.20508 5.13574L12.1211 2.20774L15.0371 5.13574"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default UploadCurvedTwoToneIcon;
