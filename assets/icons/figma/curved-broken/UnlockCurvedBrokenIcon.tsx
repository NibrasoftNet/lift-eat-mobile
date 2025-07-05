import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * UnlockCurvedBrokenIcon component
 */
export const UnlockCurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12.0005 14.0967V16.3177"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.3704 5.92877C15.7904 4.03377 14.0204 2.66577 11.9404 2.69177C9.48043 2.72177 7.48043 4.70877 7.44043 7.17577V9.34477"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.1038 21.0906C18.4618 20.5206 19.6598 18.7626 19.6598 15.0356C19.6598 10.3326 17.7498 8.76465 11.9998 8.76465C6.24984 8.76465 4.33984 10.3326 4.33984 15.0356C4.33984 19.7396 6.24984 21.3076 11.9998 21.3076"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default UnlockCurvedBrokenIcon;
