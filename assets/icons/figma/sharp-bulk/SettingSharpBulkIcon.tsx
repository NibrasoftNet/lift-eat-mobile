import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * SettingSharpBulkIcon component
 */
export const SettingSharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M21.9682 9.12695L19.1682 8.00695L19.5982 5.01995L14.6222 2.14795L12.2512 4.01395L9.87923 2.14795L4.90323 5.01995L5.33323 8.00695L2.53223 9.12695V14.8729L5.33423 15.9939L4.90423 18.9789L9.88023 21.8519L12.2512 19.9869L14.6212 21.8519L19.5972 18.9789L19.1672 15.9929L21.9682 14.8729V9.12695Z"
      fill={color}
    />
    <Path
      d="M8.31299 12C8.31299 14.171 10.079 15.937 12.25 15.937C14.421 15.937 16.188 14.171 16.188 12C16.188 9.82901 14.421 8.06201 12.25 8.06201C10.079 8.06201 8.31299 9.82901 8.31299 12Z"
      fill={color}
    />
  </Svg>
);

export default SettingSharpBulkIcon;
