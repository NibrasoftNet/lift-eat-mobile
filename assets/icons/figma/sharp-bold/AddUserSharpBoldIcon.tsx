import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * AddUserSharpBoldIcon component
 */
export const AddUserSharpBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M22.0103 9.94143H19.9653V7.93643H18.4653V9.94143H16.4203V11.4414H18.4653V13.4464H19.9653V11.4414H22.0103V9.94143Z" fill={color} />
    <Path d="M10.1537 14.3364H10.1007C6.35375 14.3364 3.62375 16.1774 2.60775 19.3904L2.48975 19.7644L2.82375 19.9684C4.78175 21.1624 7.22275 21.7674 10.0807 21.7674C10.1117 21.7684 10.1427 21.7684 10.1747 21.7674C13.0717 21.7674 15.4457 21.1784 17.4307 19.9684L17.7647 19.7644L17.6467 19.3904C16.6317 16.1774 13.9007 14.3364 10.1537 14.3364Z" fill={color} />
    <Path d="M10.1275 12.1084C12.8505 12.1084 15.0655 9.89345 15.0655 7.17045C15.0655 4.44645 12.8505 2.23145 10.1275 2.23145C7.40445 2.23145 5.18945 4.44645 5.18945 7.17045C5.18945 9.89345 7.40445 12.1084 10.1275 12.1084Z" fill={color} />
  </Svg>
);

export default AddUserSharpBoldIcon;
