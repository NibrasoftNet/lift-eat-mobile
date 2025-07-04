import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DownloadRegularBulkIcon component
 */
export const DownloadRegularBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M17.554 7.29614C20.005 7.29614 22 9.35594 22 11.8876V16.9199C22 19.4453 20.01 21.5 17.564 21.5L6.448 21.5C3.996 21.5 2 19.4412 2 16.9096V11.8773C2 9.35181 3.991 7.29614 6.438 7.29614H7.378L17.554 7.29614Z" fill={color} />
    <Path d="M12.5459 16.0374L15.4549 13.0695C15.7549 12.7627 15.7549 12.2691 15.4529 11.9634C15.1509 11.6587 14.6639 11.6597 14.3639 11.9654L12.7709 13.5905L12.7709 3.2821C12.7709 2.85042 12.4259 2.5 11.9999 2.5C11.5749 2.5 11.2309 2.85042 11.2309 3.2821L11.2309 13.5905L9.63694 11.9654C9.33694 11.6597 8.84994 11.6587 8.54794 11.9634C8.39694 12.1168 8.32094 12.3168 8.32094 12.518C8.32094 12.717 8.39694 12.9171 8.54594 13.0695L11.4549 16.0374C11.5999 16.1847 11.7959 16.268 11.9999 16.268C12.2049 16.268 12.4009 16.1847 12.5459 16.0374Z" fill={color} />
  </Svg>
);

export default DownloadRegularBulkIcon;
