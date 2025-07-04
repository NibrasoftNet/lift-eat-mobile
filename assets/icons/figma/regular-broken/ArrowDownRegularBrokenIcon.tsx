import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDownRegularBrokenIcon component
 */
export const ArrowDownRegularBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M10.6698 3.81818C10.6698 3.36655 11.0418 3 11.5002 3C11.9585 3 12.3305 3.36655 12.3305 3.81818V20.1818C12.3305 20.5135 12.1279 20.8113 11.8168 20.9378C11.715 20.9793 11.6076 21 11.5002 21C11.2843 21 11.0706 20.9171 10.9123 20.7589L4.24177 14.1589C3.91849 13.8393 3.9196 13.3211 4.24399 13.0025C4.56949 12.684 5.09538 12.684 5.41866 13.0047L10.6698 18.2007V3.81818ZM17.5813 13.0046C17.9046 12.6839 18.4305 12.6839 18.756 13.0024C19.0804 13.321 19.0815 13.8392 18.7582 14.1599L15.0792 17.7992C14.9165 17.9606 14.7039 18.0403 14.4902 18.0403C14.2787 18.0403 14.0673 17.9606 13.9045 17.8013C13.579 17.4828 13.5779 16.9657 13.9023 16.645L17.5813 13.0046Z"
      fill={color}
    />
  </Svg>
);

export default ArrowDownRegularBrokenIcon;
