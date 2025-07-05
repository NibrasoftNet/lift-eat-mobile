import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ShowSharpBoldIcon component
 */
export const ShowSharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M12.2492 10.9138C10.2302 10.9138 8.5882 12.5568 8.5882 14.5758C8.5882 16.5948 10.2302 18.2368 12.2492 18.2368C14.2682 18.2368 15.9112 16.5948 15.9112 14.5758C15.9112 12.5568 14.2682 10.9138 12.2492 10.9138Z"
      fill={color}
    />
    <Path
      d="M22.4035 14.1457C20.2695 9.6547 16.4745 6.9727 12.2525 6.9707H12.2485C8.02548 6.9727 4.23048 9.6547 2.09648 14.1457L1.66748 15.0487L3.47448 15.9077L3.90348 15.0037C5.69748 11.2267 8.81748 8.9717 12.2505 8.9707C15.6825 8.9717 18.8025 11.2267 20.5965 15.0037L21.0265 15.9077L22.8325 15.0487L22.4035 14.1457Z"
      fill={color}
    />
  </Svg>
);

export default ShowSharpBoldIcon;
