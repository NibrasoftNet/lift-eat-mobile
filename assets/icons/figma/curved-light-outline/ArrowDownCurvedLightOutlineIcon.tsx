import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDownCurvedLightOutlineIcon component
 */
export const ArrowDownCurvedLightOutlineIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M18.6843 13.805C18.7463 13.693 18.7743 13.571 18.7743 13.451C18.7743 13.183 18.6313 12.926 18.3803 12.79C18.0153 12.594 17.5603 12.729 17.3643 13.094C16.3493 14.9752 14.3576 17.8049 12.75 18.5595L12.75 4.49951C12.75 4.08551 12.414 3.74951 12 3.74951C11.586 3.74951 11.25 4.08551 11.25 4.49951L11.25 18.5579C9.64085 17.8009 7.65043 14.9739 6.63529 13.094C6.43829 12.729 5.98429 12.594 5.61929 12.79C5.25529 12.987 5.12029 13.444 5.31529 13.805C5.67029 14.466 8.87929 20.25 12.0023 20.25C15.1213 20.25 18.3293 14.466 18.6843 13.805Z"
      fill={color}
    />
  </Svg>
);

export default ArrowDownCurvedLightOutlineIcon;
