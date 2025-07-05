import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CallSilentSharpBoldIcon component
 */
export const CallSilentSharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M6.20799 16.2591L9.59199 12.4261L9.39499 12.1101C8.92199 11.3501 8.67999 10.6891 8.58299 10.3821L10.282 7.43107L6.58399 2.35107L6.19299 2.58107C4.61099 3.50907 3.45099 4.67007 2.54199 6.23307L2.48299 6.39207C2.00699 8.93507 3.32299 12.6251 5.83699 15.7921L6.20799 16.2591Z"
      fill={color}
    />
    <Path
      d="M16.8857 14.0316L13.9407 15.7266C13.5887 15.6046 12.7897 15.2836 11.8937 14.6746L19.8647 6.17258L18.7697 5.14658L3.12872 21.8306L4.22372 22.8566L8.38172 18.4206C10.4417 20.1746 13.5227 22.0126 17.4387 22.0126C17.6277 22.0126 17.8207 22.0086 18.0137 21.9996L18.1327 21.9936L18.2357 21.9356C19.8387 21.0376 21.0017 19.8736 21.8987 18.2726L22.1137 17.8876L16.8857 14.0316Z"
      fill={color}
    />
  </Svg>
);

export default CallSilentSharpBoldIcon;
