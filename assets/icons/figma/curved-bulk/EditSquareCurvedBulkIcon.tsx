import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * EditSquareCurvedBulkIcon component
 */
export const EditSquareCurvedBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M12.25 2.85352C5.05 2.85352 2.5 5.40352 2.5 12.6035C2.5 19.8035 5.05 22.3535 12.25 22.3535C19.45 22.3535 22 19.8035 22 12.6035C22 5.40352 19.45 2.85352 12.25 2.85352Z" fill={color} />
    <Path d="M16.46 11.3432L17.02 10.7132C17.42 10.2632 17.61 9.71318 17.61 9.16318C17.61 8.52318 17.34 7.87318 16.82 7.41318C15.86 6.56318 14.38 6.65318 13.52 7.61318L12.96 8.24318C13 8.26318 16.44 11.3132 16.46 11.3432Z" fill={color} />
    <Path d="M9.06997 17.8732C9.85997 17.8732 10.86 17.6732 11.6 16.8432L15.48 12.4532C15.45 12.4332 12.01 9.38318 11.98 9.35318L8.09997 13.7432C6.66997 15.3632 7.69997 17.6132 7.70997 17.6332C7.71997 17.6632 7.74997 17.6932 7.77997 17.7032C7.78997 17.7032 8.34997 17.8732 9.06997 17.8732Z" fill={color} />
  </Svg>
);

export default EditSquareCurvedBulkIcon;
