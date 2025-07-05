import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * VideoCurvedBulkIcon component
 */
export const VideoCurvedBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M22.1513 7.46992C21.3713 6.62992 18.9713 8.13992 17.6113 9.09992C17.8413 10.0899 17.9513 11.2399 17.9513 12.5399C17.9513 13.8299 17.8413 14.9599 17.6213 15.9499C18.7113 16.7199 20.4913 17.8499 21.5313 17.8499C21.7913 17.8499 22.0113 17.7799 22.1513 17.6199C23.0813 16.6299 23.0813 8.46992 22.1513 7.46992Z"
      fill={color}
    />
    <Path
      d="M9.06137 5.11035C3.59137 5.11035 1.65137 7.06035 1.65137 12.5404C1.65137 18.0204 3.59137 19.9604 9.06137 19.9604C14.5214 19.9604 16.4514 18.0204 16.4514 12.5404C16.4514 7.06035 14.5214 5.11035 9.06137 5.11035Z"
      fill={color}
    />
  </Svg>
);

export default VideoCurvedBulkIcon;
