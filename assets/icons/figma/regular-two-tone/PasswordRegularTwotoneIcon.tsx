import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PasswordRegularTwotoneIcon component
 */
export const PasswordRegularTwotoneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M16.3345 2.75024H7.66549C4.64449 2.75024 2.75049 4.88924 2.75049 7.91624V16.0842C2.75049 19.1112 4.63549 21.2502 7.66549 21.2502H16.3335C19.3645 21.2502 21.2505 19.1112 21.2505 16.0842V7.91624C21.2505 4.88924 19.3645 2.75024 16.3345 2.75024Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M10.6924 12.0002H17.0104V13.8522"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M14.1816 13.8518V11.9998"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M10.6923 12.0002C10.6923 13.0222 9.86326 13.8522 8.84026 13.8522C7.81826 13.8522 6.98926 13.0222 6.98926 12.0002C6.98926 10.9782 7.81826 10.1482 8.84026 10.1482C9.86326 10.1482 10.6923 10.9782 10.6923 12.0002Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default PasswordRegularTwotoneIcon;
