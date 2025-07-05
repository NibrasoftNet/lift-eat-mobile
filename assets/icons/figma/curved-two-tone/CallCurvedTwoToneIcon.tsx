import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CallCurvedTwoToneIcon component
 */
export const CallCurvedTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M8.20049 15.799C1.3025 8.90022 2.28338 5.74115 3.01055 4.72316C3.10396 4.55862 5.40647 1.11188 7.87459 3.13407C14.0008 8.17945 6.2451 7.46611 11.3894 12.6113"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.2002 15.7991C15.0992 22.6979 18.2595 21.717 19.2775 20.9888C19.441 20.8965 22.8879 18.594 20.8656 16.1249C15.8211 10 16.5345 17.7554 11.3891 12.6113"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default CallCurvedTwoToneIcon;
