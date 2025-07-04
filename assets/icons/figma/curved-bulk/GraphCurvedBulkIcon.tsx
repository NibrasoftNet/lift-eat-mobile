import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * GraphCurvedBulkIcon component
 */
export const GraphCurvedBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M15.382 12.9719C13.973 13.0179 12.378 13.0679 11.688 12.3779C10.941 11.6299 10.883 9.98087 10.836 8.65487C10.792 7.40287 10.757 6.41287 10.249 5.90587C9.65597 5.31287 8.66497 5.24287 7.53097 5.71087C5.17397 6.68787 2.66797 9.73287 2.66797 13.4509C2.66797 17.9719 6.34697 21.6509 10.869 21.6509C15.29 21.6509 17.863 18.2849 18.687 16.2969C19.206 15.0449 19.214 14.0369 18.709 13.5339C18.062 12.8859 16.818 12.9279 15.382 12.9719Z" fill={color} />
    <Path d="M21.7687 7.74265C21.3317 5.65665 18.6697 3.09965 16.2897 2.48065C15.1227 2.17565 14.1387 2.40365 13.5187 3.11765C12.6577 4.10965 12.3727 9.55965 13.3767 10.5637C13.7867 10.9737 14.8217 11.1477 16.0137 11.1477C17.9037 11.1477 20.1857 10.7097 20.9947 10.0737C21.6937 9.52365 21.9687 8.69565 21.7687 7.74265Z" fill={color} />
  </Svg>
);

export default GraphCurvedBulkIcon;
