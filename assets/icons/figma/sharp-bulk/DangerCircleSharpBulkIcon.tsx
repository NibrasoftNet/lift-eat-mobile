import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DangerCircleSharpBulkIcon component
 */
export const DangerCircleSharpBulkIcon = ({
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
      d="M11.5051 17.0808H13.0051V15.5808H11.4951L11.5051 17.0808Z"
      fill={color}
    />
    <Path d="M12.9951 13.9078H11.4951V7.98877H12.9951V13.9078Z" fill={color} />
  </Svg>
);

export default DangerCircleSharpBulkIcon;
