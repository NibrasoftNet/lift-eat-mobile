import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * WorkSharpBoldIcon component
 */
export const WorkSharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M20.3976 15.8149C17.9376 16.7949 15.1276 17.3149 12.2476 17.3149C9.36758 17.3149 6.55758 16.7949 4.10758 15.8149C3.73758 15.6649 3.37758 15.5149 3.02758 15.3449C2.85758 15.2649 2.68758 15.1849 2.51758 15.0849L2.73758 21.3249H21.7676L21.9776 15.0849C21.8076 15.1849 21.6376 15.2649 21.4676 15.3449C21.1176 15.5149 20.7576 15.6649 20.3976 15.8149Z"
      fill={color}
    />
    <Path
      d="M9.66739 5.5048L10.2434 4.1748H14.2564L14.8324 5.5048H9.66739ZM16.4674 5.5048L15.2434 2.6748H9.25639L8.03239 5.5048H2.50439V12.7918L2.75139 12.9368C5.15339 14.3418 8.18639 15.1598 11.3704 15.2888V16.5858H13.1294V15.2888C16.3154 15.1588 19.3484 14.3408 21.7474 12.9368L21.9954 12.7918V5.5048H16.4674Z"
      fill={color}
    />
  </Svg>
);

export default WorkSharpBoldIcon;
