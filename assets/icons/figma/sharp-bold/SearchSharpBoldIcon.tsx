import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * SearchSharpBoldIcon component
 */
export const SearchSharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M4.00244 10.5815C4.00244 6.70046 7.16044 3.54346 11.0414 3.54346C14.9214 3.54346 18.0794 6.70046 18.0794 10.5815C18.0794 14.4625 14.9214 17.6205 11.0414 17.6205C7.16044 17.6205 4.00244 14.4625 4.00244 10.5815ZM22.4974 21.0405L17.8984 16.4535C19.2544 14.8725 20.0794 12.8235 20.0794 10.5815C20.0794 5.59846 16.0244 1.54346 11.0414 1.54346C6.05744 1.54346 2.00244 5.59846 2.00244 10.5815C2.00244 15.5655 6.05744 19.6205 11.0414 19.6205C13.0634 19.6205 14.9264 18.9445 16.4334 17.8175L21.0854 22.4565L22.4974 21.0405Z"
      fill={color}
    />
  </Svg>
);

export default SearchSharpBoldIcon;
