import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * WorkSharpBulkIcon component
 */
export const WorkSharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M9.66739 5.5048L10.2434 4.1748H14.2564L14.8324 5.5048H9.66739ZM16.4674 5.5048L15.2434 2.6748H9.25639L8.03239 5.5048H2.50439V12.7918L2.75139 12.9368C5.15339 14.3418 8.18639 15.1598 11.3704 15.2888V16.5858H13.1294V15.2888C16.3154 15.1588 19.3484 14.3408 21.7474 12.9368L21.9954 12.7918V5.5048H16.4674Z"
      fill={color}
    />
    <Path
      d="M20.3976 15.815C17.9376 16.795 15.1276 17.315 12.2476 17.315C9.36758 17.315 6.55758 16.795 4.10758 15.815C3.73758 15.665 3.37758 15.515 3.02758 15.345C2.85758 15.265 2.68758 15.185 2.51758 15.085L2.73758 21.325H21.7676L21.9776 15.085C21.8076 15.185 21.6376 15.265 21.4676 15.345C21.1176 15.515 20.7576 15.665 20.3976 15.815Z"
      fill={color}
    />
  </Svg>
);

export default WorkSharpBulkIcon;
