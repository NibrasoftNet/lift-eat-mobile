import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUp2RegularBoldIcon component
 */
export const ArrowUp2RegularBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M13.131 7.36922C13.189 7.42572 13.437 7.63906 13.641 7.8378C14.924 9.00292 17.024 12.0424 17.665 13.6332C17.768 13.8748 17.986 14.4856 18 14.812C18 15.1247 17.928 15.4228 17.782 15.7073C17.578 16.0619 17.257 16.3463 16.878 16.5022C16.615 16.6025 15.828 16.7584 15.814 16.7584C14.953 16.9143 13.554 17 12.008 17C10.535 17 9.193 16.9143 8.319 16.7867C8.305 16.772 7.327 16.6162 6.992 16.4457C6.38 16.133 6 15.5222 6 14.8685V14.812C6.015 14.3863 6.395 13.491 6.409 13.491C7.051 11.9859 9.048 9.01656 10.375 7.82319C10.375 7.82319 10.716 7.48709 10.929 7.34096C11.235 7.11301 11.614 7 11.993 7C12.416 7 12.81 7.12762 13.131 7.36922Z"
      fill={color}
    />
  </Svg>
);

export default ArrowUp2RegularBoldIcon;
