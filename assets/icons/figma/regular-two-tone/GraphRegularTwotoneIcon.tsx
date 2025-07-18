import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * GraphRegularTwotoneIcon component
 */
export const GraphRegularTwotoneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M17.2777 13.8894C17.9524 13.8894 18.5188 14.4462 18.4156 15.1125C17.8103 19.0325 14.4545 21.9431 10.4072 21.9431C5.92928 21.9431 2.2998 18.3136 2.2998 13.8368C2.2998 10.1483 5.10191 6.71255 8.25665 5.9357C8.93454 5.76834 9.62928 6.24518 9.62928 6.94307C9.62928 11.6715 9.78823 12.8947 10.6861 13.5599C11.584 14.2252 12.6398 13.8894 17.2777 13.8894Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M21.6921 9.9517C21.7458 6.9138 18.0142 2.01696 13.4669 2.10117C13.1132 2.10749 12.83 2.40222 12.8142 2.75485C12.6995 5.25275 12.8542 8.48959 12.9406 9.95696C12.9669 10.4138 13.3258 10.7727 13.7816 10.7991C15.29 10.8854 18.6448 11.0033 21.1069 10.6306C21.4416 10.5801 21.6869 10.2896 21.6921 9.9517Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default GraphRegularTwotoneIcon;
