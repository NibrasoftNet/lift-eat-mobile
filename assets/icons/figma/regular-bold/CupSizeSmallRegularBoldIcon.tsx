import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CupSizeSmallRegularBoldIcon component
 */
export const CupSizeSmallRegularBoldIcon = ({
  color = '#00A9F1',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 45 30" fill="none" {...props}>
    <Path
      d="M55.4104 24.79C57.7192 24.232 61.3226 23.6163 64.1563 25.985C67.0477 28.4018 66.1925 33.5005 63.9617 35.4128C61.1547 37.8189 52.8781 39.7024 52.3886 41.9172C51.899 44.1319 53.6253 45.0202 51.5837 46.4868C49.7558 47.7983 47.9408 45.0148 48.7361 42.8588C49.758 40.0925 50.7884 38.8333 54.9753 37.0589C59.4327 35.1712 63.7083 31.7528 61.1333 28.8882C58.5583 26.0235 53.5975 29.6984 53.5975 29.6984L55.4104 24.79Z"
      fill="#B0DCF9"
    />
    <Path
      d="M32.9561 49.4177H39.7053C39.8186 49.4177 39.9319 49.4016 40.0398 49.3674C48.993 46.5391 54.7064 30.2456 55.8822 25.2901C56.0393 24.6295 55.538 24 54.8593 24H32.9561H11.053C10.3732 24 9.87187 24.6295 10.029 25.2901C11.2059 30.2456 16.9182 46.5391 25.8714 49.3674C25.9794 49.4016 26.0927 49.4177 26.206 49.4177H32.9561Z"
      fill={color}
    />
    <Path
      d="M32.9561 49.4177H39.8762C48.916 46.739 54.6892 30.3023 55.88 25.3019C56.0382 24.6359 55.5326 24 54.8463 24H32.9561V49.4177Z"
      fill={color === '#00A9F1' ? '#1A96F0' : color}
    />
    <Path d="M39.825 51.1013H26.2061V49.4178H39.825V51.1013Z" fill="#B0DCF9" />
  </Svg>
);

export default CupSizeSmallRegularBoldIcon;
