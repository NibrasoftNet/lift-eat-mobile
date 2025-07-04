import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CallSilentRegularBulkIcon component
 */
export const CallSilentRegularBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M6.18493 14.2054C-0.246553 6.91826 2.96919 4.73963 3.25374 4.38547C6.32245 1.27315 6.79846 2.68979 9.20921 5.13672C11.2402 7.20803 8.60732 8.19539 9.68628 10.6531L6.18493 14.2054Z"
      fill={color}
    />
    <Path
      d="M12.09 13.3826C15.3702 16.0763 16.2953 12.2235 18.6188 14.5846C21.0158 17.0315 22.3941 17.5252 19.3547 20.6268C18.9973 20.938 16.6949 24.4689 8.79932 16.7417L12.09 13.3826Z"
      fill={color}
    />
    <Path
      d="M21.3746 3.85937V3.86954L11.9584 13.5151L3.44417 22.246C3.27567 22.4086 3.06752 22.5 2.84946 22.5C2.6314 22.5 2.42326 22.4086 2.24484 22.246C1.96731 21.9512 1.92767 21.5141 2.11599 21.1889L2.14573 21.1482C2.16555 21.1167 2.18537 21.0873 2.21511 21.0568L20.1753 2.62954C20.324 2.46691 20.542 2.36426 20.77 2.36426C20.998 2.36426 21.216 2.46691 21.3746 2.62954C21.7017 2.97511 21.7017 3.5138 21.3746 3.85937Z"
      fill={color}
    />
  </Svg>
);

export default CallSilentRegularBulkIcon;
