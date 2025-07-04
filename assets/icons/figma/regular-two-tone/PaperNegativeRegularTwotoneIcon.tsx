import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PaperNegativeRegularTwotoneIcon component
 */
export const PaperNegativeRegularTwotoneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M14.7365 2.76196H8.08449C6.02449 2.76196 4.25049 4.43096 4.25049 6.49096V17.34C4.25049 19.516 5.90849 21.115 8.08449 21.115H16.0725C18.1325 21.115 19.8025 19.4 19.8025 17.34V8.03796L14.7365 2.76196Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M14.2941 13.7473H9.39307" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M14.4736 2.75024V5.65924C14.4736 7.07924 15.6226 8.23124 17.0426 8.23424C18.3586 8.23724 19.7056 8.23824 19.7966 8.23224" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default PaperNegativeRegularTwotoneIcon;
