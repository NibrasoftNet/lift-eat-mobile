import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CallSilentRegularLightBorderIcon component
 */
export const CallSilentRegularLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M6.58532 14.2053C0.153838 6.91814 3.36958 4.73951 3.65413 4.38535C6.72284 1.27303 7.19885 2.68967 9.6096 5.1366C11.6406 7.20791 9.00771 8.19527 10.0867 10.6529"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.4904 13.3824C15.7706 16.0762 16.6957 12.2234 19.0192 14.5844C21.4162 17.0314 22.7945 17.5251 19.7551 20.6267C19.3977 20.9379 17.0952 24.4688 9.19971 16.7416"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M4.49988 21.5L19.4999 5.49996"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default CallSilentRegularLightBorderIcon;
