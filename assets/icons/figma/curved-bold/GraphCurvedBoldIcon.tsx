import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * GraphCurvedBoldIcon component
 */
export const GraphCurvedBoldIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M21.7687 7.74265C21.3317 5.65665 18.6697 3.09965 16.2897 2.48065C15.1227 2.17565 14.1387 2.40365 13.5187 3.11765C12.6577 4.10965 12.3727 9.55965 13.3767 10.5637C13.7867 10.9737 14.8217 11.1477 16.0137 11.1477C17.9037 11.1477 20.1857 10.7097 20.9947 10.0737C21.6937 9.52365 21.9687 8.69565 21.7687 7.74265Z" fill={color} />
    <Path d="M15.382 12.9722C13.973 13.0182 12.378 13.0682 11.688 12.3782C10.941 11.6302 10.883 9.98118 10.836 8.65518C10.792 7.40318 10.757 6.41318 10.249 5.90618C9.65597 5.31318 8.66497 5.24318 7.53097 5.71118C5.17397 6.68818 2.66797 9.73318 2.66797 13.4512C2.66797 17.9722 6.34697 21.6512 10.869 21.6512C15.29 21.6512 17.863 18.2852 18.687 16.2972C19.206 15.0452 19.214 14.0372 18.709 13.5342C18.062 12.8862 16.818 12.9282 15.382 12.9722Z" fill={color} />
  </Svg>
);

export default GraphCurvedBoldIcon;
