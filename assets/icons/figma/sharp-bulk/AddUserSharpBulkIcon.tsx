import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * AddUserSharpBulkIcon component
 */
export const AddUserSharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M10.1542 14.3364H10.1012C6.35423 14.3364 3.62423 16.1774 2.60823 19.3904L2.49023 19.7644L2.82423 19.9684C4.78223 21.1624 7.22323 21.7674 10.0812 21.7674C10.1122 21.7684 10.1432 21.7684 10.1752 21.7674C13.0722 21.7674 15.4462 21.1784 17.4312 19.9684L17.7652 19.7644L17.6472 19.3904C16.6322 16.1774 13.9012 14.3364 10.1542 14.3364Z"
      fill={color}
    />
    <Path
      d="M22.0104 9.94152H19.9654V7.93652H18.4654V9.94152H16.4204V11.4415H18.4654V13.4465H19.9654V11.4415H22.0104V9.94152Z"
      fill={color}
    />
    <Path
      d="M10.1275 12.1084C12.8505 12.1084 15.0655 9.89345 15.0655 7.17045C15.0655 4.44645 12.8505 2.23145 10.1275 2.23145C7.40445 2.23145 5.18945 4.44645 5.18945 7.17045C5.18945 9.89345 7.40445 12.1084 10.1275 12.1084Z"
      fill={color}
    />
  </Svg>
);

export default AddUserSharpBulkIcon;
