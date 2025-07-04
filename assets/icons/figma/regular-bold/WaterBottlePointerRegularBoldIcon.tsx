import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * WaterBottlePointerRegularBoldIcon component
 */
export const WaterBottlePointerRegularBoldIcon = ({
  color = '#00A9F1',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 45 46" fill="none" {...props}>
    <Path
      d="M38.3614 116.076L38.1282 109.463C38.1282 109.463 39.7658 107.623 42.2023 105.417C43.3674 104.362 44.5724 103.272 45.5881 102.068C47.6349 99.6435 48.5503 95.4129 45.721 91.8512C43.0176 88.4471 38.3225 89.8504 37.7068 90.1798L36.957 85.6229C39.46 84.8138 45.0204 83.6876 49.2663 89.0352C53.4847 94.344 52.3493 101.08 49.0474 104.989C47.8353 106.424 46.5158 107.619 45.2413 108.774C43.08 110.73 39.0498 113.808 38.3614 116.076Z"
      fill={color}
    />
    <Path
      d="M38.6137 126.62H5.77316C5.33127 126.62 4.98039 126.251 5.00085 125.81L7.03537 82.7364C7.05481 82.3242 7.39443 81.9999 7.80768 81.9999H36.5792C36.9914 81.9999 37.332 82.3242 37.3515 82.7364L39.386 125.81C39.4075 126.251 39.0556 126.62 38.6137 126.62Z"
      fill={color}
    />
    <Path
      d="M38.5993 126.62H22.1934V81.9999H36.5495C36.9791 81.9999 37.333 82.3375 37.3525 82.7661L39.3859 125.796C39.4064 126.245 39.0484 126.62 38.5993 126.62Z"
      fill={color === '#00A9F1' ? '#1A96F0' : color}
    />
    <Path
      d="M38.8428 114.32H5.54297L6.01655 104.31H38.3713L38.8428 114.32Z"
      fill="#C5EAFF"
    />
    <Path
      d="M38.8459 114.32H22.1934L22.1965 104.31H38.3733L38.8459 114.32Z"
      fill="#B0DCF9"
    />
    <Path
      d="M38.0543 97.6103H6.33789L6.80533 87.5994H37.5817L38.0543 97.6103Z"
      fill="#C5EAFF"
    />
    <Path
      d="M38.0541 97.6103H22.1934V87.5994H37.5816L38.0541 97.6103Z"
      fill="#B0DCF9"
    />
  </Svg>
);

export default WaterBottlePointerRegularBoldIcon;
