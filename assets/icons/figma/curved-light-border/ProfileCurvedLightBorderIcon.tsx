import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ProfileCurvedLightBorderIcon component
 */
export const ProfileCurvedLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M11.8445 21.6623C8.15273 21.6623 5 21.0878 5 18.787C5 16.4862 8.13273 14.3623 11.8445 14.3623C15.5364 14.3623 18.6891 16.4657 18.6891 18.7664C18.6891 21.0663 15.5564 21.6623 11.8445 21.6623Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M11.8375 11.174C14.2602 11.174 16.2239 9.21039 16.2239 6.78766C16.2239 4.36494 14.2602 2.40039 11.8375 2.40039C9.41477 2.40039 7.45022 4.36494 7.45022 6.78766C7.44204 9.20221 9.39204 11.1658 11.8066 11.174C11.8175 11.174 11.8275 11.174 11.8375 11.174Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ProfileCurvedLightBorderIcon;
