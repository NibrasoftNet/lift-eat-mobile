import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CloseSquareCurvedBulkIcon component
 */
export const CloseSquareCurvedBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M12.25 2.78516C5.052 2.78516 2.5 5.33716 2.5 12.5352C2.5 19.7332 5.052 22.2852 12.25 22.2852C19.449 22.2852 22 19.7332 22 12.5352C22 5.33716 19.449 2.78516 12.25 2.78516Z"
      fill={color}
    />
    <Path
      d="M14.6504 15.6787C14.8424 15.6787 15.0344 15.6047 15.1804 15.4587C15.4734 15.1657 15.4734 14.6907 15.1804 14.3977L13.3064 12.5247L15.1694 10.6607C15.4624 10.3677 15.4624 9.89366 15.1694 9.60066C14.8764 9.30766 14.4024 9.30766 14.1094 9.60066L12.2454 11.4647L10.3794 9.59866C10.0864 9.30566 9.61236 9.30566 9.31936 9.59866C9.02636 9.89166 9.02636 10.3657 9.31936 10.6587L11.1854 12.5247L9.31936 14.3927C9.02636 14.6857 9.02636 15.1597 9.31936 15.4527C9.46536 15.5997 9.65836 15.6727 9.84936 15.6727C10.0414 15.6727 10.2334 15.5997 10.3794 15.4527L12.2464 13.5857L14.1194 15.4587C14.2664 15.6047 14.4574 15.6787 14.6504 15.6787Z"
      fill={color}
    />
  </Svg>
);

export default CloseSquareCurvedBulkIcon;
