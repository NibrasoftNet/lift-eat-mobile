import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeft3CurvedBrokenIcon component
 */
export const ArrowLeft3CurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M11.3516 11.9971H20.3016"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M5.42824 10.0373C4.43124 10.8183 3.69824 11.5773 3.69824 12.0073C3.69824 13.2673 10.0622 17.2773 10.7842 16.5573C11.5062 15.8373 11.5752 8.24729 10.7842 7.45729C10.4832 7.15729 9.39024 7.55829 8.15024 8.24129"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ArrowLeft3CurvedBrokenIcon;
