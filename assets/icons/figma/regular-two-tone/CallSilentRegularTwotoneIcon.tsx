import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CallSilentRegularTwotoneIcon component
 */
export const CallSilentRegularTwotoneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M6.58532 14.2054C0.153838 6.91826 3.36958 4.73963 3.65413 4.38547C6.72284 1.27315 7.19885 2.68979 9.6096 5.13672C11.6406 7.20803 9.00771 8.19539 10.0867 10.6531" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M12.4904 13.3826C15.7706 16.0763 16.6957 12.2235 19.0192 14.5846C21.4162 17.0315 22.7945 17.5252 19.7551 20.6268C19.3977 20.938 17.0952 24.4689 9.19971 16.7417" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M4.49988 21.5002L19.4999 5.50021" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default CallSilentRegularTwotoneIcon;
