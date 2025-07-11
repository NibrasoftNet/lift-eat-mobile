import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ProfileRegularLightOutlineIcon component
 */
export const ProfileRegularLightOutlineIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M11.889 12.6188H11.921C14.849 12.6188 17.23 10.2378 17.23 7.30976C17.23 4.38176 14.849 1.99976 11.921 1.99976C8.99202 1.99976 6.61002 4.38176 6.61002 7.30676C6.60002 10.2268 8.96702 12.6098 11.889 12.6188ZM8.03802 7.30976C8.03802 5.16876 9.78002 3.42776 11.921 3.42776C14.061 3.42776 15.802 5.16876 15.802 7.30976C15.802 9.44976 14.061 11.1918 11.921 11.1918H11.892C9.76002 11.1838 8.03102 9.44376 8.03802 7.30976Z"
      fill={color}
    />
    <Path
      d="M4 18.1731C4 21.8701 9.962 21.8701 11.921 21.8701C15.32 21.8701 19.84 21.4891 19.84 18.1931C19.84 14.4961 13.88 14.4961 11.921 14.4961C8.521 14.4961 4 14.8771 4 18.1731ZM5.5 18.1731C5.5 16.7281 7.66 15.9961 11.921 15.9961C16.181 15.9961 18.34 16.7351 18.34 18.1931C18.34 19.6381 16.181 20.3701 11.921 20.3701C7.66 20.3701 5.5 19.6311 5.5 18.1731Z"
      fill={color}
    />
  </Svg>
);

export default ProfileRegularLightOutlineIcon;
