import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CloseSquareSharpBulkIcon component
 */
export const CloseSquareSharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M12.25 2.78467C6.874 2.78467 2.5 7.15867 2.5 12.5347C2.5 17.9107 6.874 22.2847 12.25 22.2847C17.626 22.2847 22 17.9107 22 12.5347C22 7.15867 17.626 2.78467 12.25 2.78467Z"
      fill={color}
    />
    <Path
      d="M14.6496 15.9849L15.7106 14.9239L13.3106 12.5259L15.7106 10.1309L14.6506 9.06889L12.2496 11.4659L9.84957 9.06689L8.78857 10.1279L11.1876 12.5259L8.78857 14.9209L9.84857 15.9819L12.2486 13.5859L14.6496 15.9849Z"
      fill={color}
    />
  </Svg>
);

export default CloseSquareSharpBulkIcon;
