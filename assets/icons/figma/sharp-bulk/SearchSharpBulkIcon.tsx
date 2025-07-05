import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * SearchSharpBulkIcon component
 */
export const SearchSharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M11.041 3.54297C7.1537 3.54297 4.00244 6.69423 4.00244 10.5815C4.00244 14.4688 7.1537 17.62 11.041 17.62C14.9283 17.62 18.0795 14.4688 18.0795 10.5815C18.0795 6.69423 14.9283 3.54297 11.041 3.54297ZM2.00244 10.5815C2.00244 5.58966 6.04913 1.54297 11.041 1.54297C16.0328 1.54297 20.0795 5.58966 20.0795 10.5815C20.0795 15.5734 16.0328 19.62 11.041 19.62C6.04913 19.62 2.00244 15.5734 2.00244 10.5815Z"
      fill={color}
    />
    <Path
      d="M16.5281 15.0874L22.4976 21.0414L21.0853 22.4575L15.1157 16.5035L16.5281 15.0874Z"
      fill={color}
    />
  </Svg>
);

export default SearchSharpBulkIcon;
