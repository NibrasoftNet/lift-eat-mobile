import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * GraphSharpBulkIcon component
 */
export const GraphSharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M11.2232 5.2417H10.7232C9.08523 5.2417 7.49923 5.7227 6.13723 6.6327C4.77523 7.5427 3.72423 8.8237 3.09723 10.3367C2.47023 11.8497 2.30823 13.4997 2.62823 15.1057C2.94723 16.7137 3.72823 18.1747 4.88723 19.3317C6.04423 20.4897 7.50523 21.2707 9.11223 21.5907C9.64822 21.6977 10.1882 21.7507 10.7272 21.7507C11.8032 21.7507 12.8722 21.5387 13.8812 21.1207C15.3942 20.4937 16.6762 19.4437 17.5852 18.0817C18.4952 16.7197 18.9762 15.1347 18.9762 13.4957V12.9957H11.2232V5.2417Z"
      fill={color}
    />
    <Path
      d="M19.6138 4.667C18.0558 3.108 15.9828 2.25 13.7778 2.25H13.2778V11.003H22.0318V10.503C22.0318 8.299 21.1728 6.227 19.6138 4.667Z"
      fill={color}
    />
  </Svg>
);

export default GraphSharpBulkIcon;
