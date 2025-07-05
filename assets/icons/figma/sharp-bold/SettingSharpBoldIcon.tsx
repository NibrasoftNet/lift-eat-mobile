import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * SettingSharpBoldIcon component
 */
export const SettingSharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.2502 15.9369C10.0792 15.9369 8.31323 14.1709 8.31323 11.9999C8.31323 9.82895 10.0792 8.06195 12.2502 8.06195C14.4212 8.06195 16.1882 9.82895 16.1882 11.9999C16.1882 14.1709 14.4212 15.9369 12.2502 15.9369ZM21.9682 9.12695L19.1682 8.00695L19.5982 5.01995L14.6222 2.14795L12.2512 4.01395L9.87923 2.14795L4.90323 5.01995L5.33323 8.00695L2.53223 9.12695V14.8729L5.33423 15.9939L4.90423 18.9789L9.88023 21.8519L12.2512 19.9869L14.6212 21.8519L19.5972 18.9789L19.1672 15.9929L21.9682 14.8729V9.12695Z"
      fill={color}
    />
  </Svg>
);

export default SettingSharpBoldIcon;
