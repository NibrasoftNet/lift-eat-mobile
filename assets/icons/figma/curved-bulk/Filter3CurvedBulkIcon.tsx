import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Filter3CurvedBulkIcon component
 */
export const Filter3CurvedBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M12.2529 22.1055L12.25 3.10547H12.5181C15.574 3.10645 17.7781 3.10449 19.2729 3.50928C20.9619 3.96729 21.75 4.9834 21.75 6.70557C21.75 8.84326 19.823 10.4814 17.96 12.0654C16.3169 13.4595 14.7671 14.7783 14.7671 16.2036C14.7671 19.6294 14.7671 22.1055 12.2529 22.1055Z"
      fill={color}
    />
    <Path
      d="M12.25 3.10507H11.979C8.932 3.09407 6.72 3.10407 5.226 3.50907C3.537 3.96707 2.75 4.98307 2.75 6.70507C2.75 8.84265 4.67625 10.4804 6.53891 12.0641L6.54 12.0651C8.182 13.4591 9.733 14.7781 9.733 16.2031C9.733 19.6277 9.733 22.1031 12.25 22.1051V3.10507Z"
      fill={color}
    />
  </Svg>
);

export default Filter3CurvedBulkIcon;
