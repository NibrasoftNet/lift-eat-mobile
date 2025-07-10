import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * VoiceSharpBrokenIcon component
 */
export const VoiceSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M9.52979 21.854H14.9698"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.2505 21.8539V17.4639"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M20.7549 12.3539V7.96387"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M3.74512 12.3539V7.96387"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.5358 13.16C16.5358 15.537 14.6178 17.464 12.2498 17.464C9.88384 17.464 7.96484 15.537 7.96484 13.16V7.16C7.96484 4.782 9.88384 2.854 12.2498 2.854C14.6178 2.854 16.5358 4.782 16.5358 7.16V9.351"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default VoiceSharpBrokenIcon;
