import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ChartRegularBulkIcon component
 */
export const ChartRegularBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M16.6756 2H7.33333C3.92889 2 2 3.92889 2 7.33333V16.6667C2 20.0711 3.92889 22 7.33333 22H16.6756C20.08 22 22 20.0711 22 16.6667V7.33333C22 3.92889 20.08 2 16.6756 2Z"
      fill={color}
    />
    <Path
      d="M16.6398 12.9956C16.1775 12.9956 15.8042 13.3689 15.8042 13.8312V17.0756C15.8042 17.5289 16.1775 17.9023 16.6309 17.9023C17.0931 17.9023 17.4664 17.5289 17.4664 17.0756V13.8312C17.4664 13.3689 17.0931 12.9956 16.6398 12.9956Z"
      fill={color}
    />
    <Path
      d="M7.36866 9.36902C6.91533 9.36902 6.54199 9.74235 6.54199 10.2046V17.0757C6.54199 17.529 6.91533 17.9024 7.36866 17.9024C7.83088 17.9024 8.20421 17.529 8.20421 17.0757V10.2046C8.20421 9.74235 7.83088 9.36902 7.36866 9.36902Z"
      fill={color}
    />
    <Path
      d="M12.0352 6.08899C11.5818 6.08899 11.2085 6.46232 11.2085 6.92454V17.0757C11.2085 17.529 11.5818 17.9023 12.0352 17.9023C12.4974 17.9023 12.8707 17.529 12.8707 17.0757V6.92454C12.8707 6.46232 12.4974 6.08899 12.0352 6.08899Z"
      fill={color}
    />
  </Svg>
);

export default ChartRegularBulkIcon;
