import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * GraphRegularLightBorderIcon component
 */
export const GraphRegularLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M17.2777 13.8891C17.9524 13.8891 18.5188 14.446 18.4156 15.1123C17.8103 19.0323 14.4545 21.9428 10.4072 21.9428C5.92928 21.9428 2.2998 18.3134 2.2998 13.8365C2.2998 10.1481 5.10191 6.7123 8.25665 5.93546C8.93454 5.76809 9.62928 6.24493 9.62928 6.94283C9.62928 11.6712 9.78823 12.8944 10.6861 13.5597C11.584 14.2249 12.6398 13.8891 17.2777 13.8891Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M21.6921 9.95157C21.7458 6.91368 18.0142 2.01684 13.4669 2.10105C13.1132 2.10736 12.83 2.4021 12.8142 2.75473C12.6995 5.25263 12.8542 8.48947 12.9406 9.95684C12.9669 10.4137 13.3258 10.7726 13.7816 10.7989C15.29 10.8853 18.6448 11.0032 21.1069 10.6305C21.4416 10.58 21.6869 10.2895 21.6921 9.95157Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default GraphRegularLightBorderIcon;
