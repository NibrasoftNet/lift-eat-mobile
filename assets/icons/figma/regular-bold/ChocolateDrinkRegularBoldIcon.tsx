import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ChocolateDrinkRegularBoldIcon component
 */
export const ChocolateDrinkRegularBoldIcon = ({
  color = '#7A5548',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 45 56" fill="none" {...props}>
    <Path
      d="M33.9119 10.3453L33.1534 18.7269H25.2576L27.6269 10.3453H33.9119ZM25.7757 38.9183L18.3687 36.3412L20.9458 28.9341L28.3529 31.5113L25.7757 38.9183ZM12.514 46.0799L7.45759 40.085L13.4529 35.0286L18.5092 41.0235L12.514 46.0799ZM16.6021 25.6996L14.9566 30.4293L10.2268 28.7838L11.8724 24.054L16.6021 25.6996ZM2.41036 18.7269L1.76465 10.3453H25.4857L23.1164 18.7269H2.41036ZM45.0188 6.69815L45.5644 4.7111L28.562 0.0429573L28.4104 0L26.0531 8.33865H0L3.48823 52.1302C3.51414 54.2682 5.26141 56 7.40578 56H27.6579C29.7994 56 31.5448 54.2729 31.5751 52.1387L35.674 8.33865H28.1943L29.8364 2.52945L45.0188 6.69815Z"
      fill={color}
    />
  </Svg>
);

export default ChocolateDrinkRegularBoldIcon;
