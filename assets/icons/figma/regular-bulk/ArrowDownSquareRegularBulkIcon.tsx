import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDownSquareRegularBulkIcon component
 */
export const ArrowDownSquareRegularBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M2 7.91588V16.0839C2 19.6229 4.276 21.9999 7.665 21.9999H16.335C19.724 21.9999 22 19.6229 22 16.0839V7.91588C22 4.37788 19.723 1.99988 16.334 1.99988H7.665C4.276 1.99988 2 4.37788 2 7.91588Z" fill={color} />
    <Path d="M7.72082 12.8553L11.4688 16.6203C11.7508 16.9033 12.2498 16.9033 12.5328 16.6203L16.2808 12.8553C16.5728 12.5613 16.5718 12.0863 16.2778 11.7943C15.9838 11.5023 15.5098 11.5023 15.2168 11.7963L12.7498 14.2733V7.91833C12.7498 7.50333 12.4138 7.16833 11.9998 7.16833C11.5858 7.16833 11.2498 7.50333 11.2498 7.91833V14.2733L8.78382 11.7963C8.63682 11.6493 8.44482 11.5763 8.25182 11.5763C8.06082 11.5763 7.86882 11.6493 7.72282 11.7943C7.42982 12.0863 7.42882 12.5613 7.72082 12.8553Z" fill={color} />
  </Svg>
);

export default ArrowDownSquareRegularBulkIcon;
