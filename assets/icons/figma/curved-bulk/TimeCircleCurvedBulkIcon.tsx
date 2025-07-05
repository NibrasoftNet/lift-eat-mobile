import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * TimeCircleCurvedBulkIcon component
 */
export const TimeCircleCurvedBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.25 2.25C6.874 2.25 2.5 6.624 2.5 12C2.5 17.376 6.874 21.75 12.25 21.75C17.626 21.75 22 17.376 22 12C22 6.624 17.626 2.25 12.25 2.25Z"
      fill={color}
    />
    <Path
      d="M16.4276 13.5167H16.4406C16.8486 13.5167 17.1836 13.1887 17.1906 12.7787C17.1966 12.3647 16.8666 12.0237 16.4526 12.0167L12.6606 11.9547V7.8457C12.6606 7.4317 12.3246 7.0957 11.9106 7.0957C11.4966 7.0957 11.1606 7.4317 11.1606 7.8457V12.6937C11.1606 13.1027 11.4886 13.4367 11.8986 13.4437L16.4276 13.5167Z"
      fill={color}
    />
  </Svg>
);

export default TimeCircleCurvedBulkIcon;
