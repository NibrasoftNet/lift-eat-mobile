import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * InfoSquareCurvedBoldIcon component
 */
export const InfoSquareCurvedBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M12.255 9.78467H12.246C11.832 9.78467 11.496 9.44867 11.496 9.03467C11.496 8.62067 11.832 8.28467 12.246 8.28467C12.66 8.28467 13.001 8.62067 13.001 9.03467C13.001 9.44867 12.669 9.78467 12.255 9.78467ZM13 16.4297C13 16.8437 12.664 17.1797 12.25 17.1797C11.836 17.1797 11.5 16.8437 11.5 16.4297V12.5347C11.5 12.1207 11.836 11.7847 12.25 11.7847C12.664 11.7847 13 12.1207 13 12.5347V16.4297ZM12.25 2.78467C5.052 2.78467 2.5 5.33667 2.5 12.5347C2.5 19.7327 5.052 22.2847 12.25 22.2847C19.448 22.2847 22 19.7327 22 12.5347C22 5.33667 19.448 2.78467 12.25 2.78467Z"
      fill={color}
    />
  </Svg>
);

export default InfoSquareCurvedBoldIcon;
