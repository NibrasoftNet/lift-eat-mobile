import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PlayRegularTwotoneIcon component
 */
export const PlayRegularTwotoneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 2C17.5228 2 22 6.47716 22 12C22 17.5228 17.5228 22 12 22C6.47716 22 2 17.5228 2 12C2 6.47716 6.47716 2 12 2Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.0502 12.4668C14.3212 13.2528 12.3372 14.5828 11.3222 15.0098C11.1602 15.0778 10.7472 15.2218 10.6582 15.2238C10.4692 15.2298 10.2872 15.1238 10.1992 14.9538C10.1652 14.8878 10.0652 14.4568 10.0332 14.2648C9.93815 13.6808 9.88915 12.7738 9.89015 11.8618C9.88915 10.9048 9.94215 9.95483 10.0482 9.37683C10.0762 9.22083 10.1582 8.86183 10.1822 8.80383C10.2272 8.69583 10.3092 8.61083 10.4082 8.55783C10.4842 8.51683 10.5712 8.49483 10.6582 8.49783C10.7472 8.49983 11.1092 8.62683 11.2332 8.67583C12.2112 9.05583 14.2802 10.4338 15.0402 11.2438C15.1082 11.3168 15.2952 11.5128 15.3262 11.5528C15.3972 11.6428 15.4322 11.7518 15.4322 11.8618C15.4322 11.9638 15.4012 12.0678 15.3372 12.1548C15.3042 12.1998 15.1132 12.3998 15.0502 12.4668Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default PlayRegularTwotoneIcon;
