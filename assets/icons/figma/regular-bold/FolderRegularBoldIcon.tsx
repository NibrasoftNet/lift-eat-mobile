import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * FolderRegularBoldIcon component
 */
export const FolderRegularBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M13.45 4.8802H16.52C20.21 4.8802 22.01 6.8502 22 10.8902V15.7602C22 19.6202 19.62 22.0002 15.75 22.0002H8.24C4.39 22.0002 2 19.6202 2 15.7502V8.2402C2 4.1002 3.84 2.0002 7.47 2.0002H9.05C9.981 1.9902 10.85 2.4202 11.42 3.1502L12.3 4.3202C12.58 4.6702 13 4.8802 13.45 4.8802ZM7.37 15.2902H16.63C17.04 15.2902 17.37 14.9502 17.37 14.5402C17.37 14.1202 17.04 13.7902 16.63 13.7902H7.37C6.95 13.7902 6.62 14.1202 6.62 14.5402C6.62 14.9502 6.95 15.2902 7.37 15.2902Z"
      fill={color}
    />
  </Svg>
);

export default FolderRegularBoldIcon;
