import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRight3CurvedLightOutlineIcon component
 */
export const ArrowRight3CurvedLightOutlineIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M14.8627 6.95968C14.4097 6.77168 13.9267 6.60568 13.4967 6.60568C13.1877 6.60568 12.9067 6.69068 12.6837 6.91468C12.2201 7.38009 11.9629 9.23873 11.9123 11.2495L3.69551 11.2495C3.28151 11.2495 2.94551 11.5855 2.94551 11.9995C2.94551 12.4135 3.28151 12.7495 3.69551 12.7495L11.9127 12.7495C11.9642 14.756 12.2215 16.6086 12.6847 17.0727C13.2487 17.6357 14.1817 17.3487 14.9347 17.0387C16.5077 16.3877 21.0547 13.6407 21.0547 11.9927C21.0547 10.2917 16.3047 7.55668 14.8627 6.95968ZM13.6847 8.12468C14.9807 8.36468 19.0477 11.0357 19.5337 11.9947C19.0497 12.9907 14.9817 15.6857 13.7087 15.8837C13.2957 14.6297 13.3027 9.32668 13.6847 8.12468Z"
      fill={color}
    />
  </Svg>
);

export default ArrowRight3CurvedLightOutlineIcon;
