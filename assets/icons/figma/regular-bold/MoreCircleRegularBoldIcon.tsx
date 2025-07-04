import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * MoreCircleRegularBoldIcon component
 */
export const MoreCircleRegularBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M2 11.9999C2 6.47991 6.47 1.99991 12 1.99991C17.52 1.99991 22 6.47991 22 11.9999C22 17.5199 17.52 21.9999 12 21.9999C6.47 21.9999 2 17.5199 2 11.9999ZM7.52 13.1999C6.86 13.1999 6.32 12.6599 6.32 11.9999C6.32 11.3399 6.86 10.8009 7.52 10.8009C8.18 10.8009 8.71 11.3399 8.71 11.9999C8.71 12.6599 8.18 13.1999 7.52 13.1999ZM10.8 11.9999C10.8 12.6599 11.34 13.1999 12 13.1999C12.66 13.1999 13.19 12.6599 13.19 11.9999C13.19 11.3399 12.66 10.8009 12 10.8009C11.34 10.8009 10.8 11.3399 10.8 11.9999ZM15.28 11.9999C15.28 12.6599 15.81 13.1999 16.48 13.1999C17.14 13.1999 17.67 12.6599 17.67 11.9999C17.67 11.3399 17.14 10.8009 16.48 10.8009C15.81 10.8009 15.28 11.3399 15.28 11.9999Z"
      fill={color}
    />
  </Svg>
);

export default MoreCircleRegularBoldIcon;
