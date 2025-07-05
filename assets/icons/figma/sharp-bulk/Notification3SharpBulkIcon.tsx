import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Notification3SharpBulkIcon component
 */
export const Notification3SharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M9.80284 18.8298C9.95082 20.057 10.9855 21.0142 12.251 21.0142C13.5165 21.0142 14.5521 20.057 14.7001 18.8298H16.2012C16.0474 20.8842 14.3436 22.5142 12.251 22.5142C10.1584 22.5142 8.45559 20.8842 8.30176 18.8298H9.80284Z"
      fill={color}
    />
    <Path d="M13.001 3.40381V1.76318H11.501V3.40381H13.001Z" fill={color} />
    <Path
      d="M9.80273 18.8301C9.80176 18.8218 9.80078 18.8135 9.7998 18.8052H14.7026C14.7017 18.8135 14.7007 18.8218 14.6997 18.8301H16.2009C16.2017 18.8218 16.2021 18.8135 16.2026 18.8052H21.1548L20.6147 18.021C19.5967 16.5439 19.0586 14.8164 19.0586 13.0244V10.231C19.0586 6.72998 16.4026 3.84033 13.0007 3.46533V3.40381H11.5007V3.46533C8.09863 3.84033 5.44165 6.72998 5.44165 10.231V13.0244C5.44165 14.8184 4.90381 16.5464 3.88574 18.021L3.3457 18.8052H8.2998C8.30029 18.8135 8.30078 18.8218 8.30151 18.8301H9.80273Z"
      fill={color}
    />
  </Svg>
);

export default Notification3SharpBulkIcon;
