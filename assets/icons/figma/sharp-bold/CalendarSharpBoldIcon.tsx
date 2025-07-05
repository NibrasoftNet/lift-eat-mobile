import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CalendarSharpBoldIcon component
 */
export const CalendarSharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M16.9848 4.37967V2.65967H15.4848V7.20967H14.4848V4.37967H9.5148V2.65967H8.0148V7.20967H7.0148V4.37967H3.4248V9.50967H21.0748V4.37967H16.9848Z"
      fill={color}
    />
    <Path
      d="M8.8948 16.7197V18.2197H7.3948L7.3848 16.7197H8.8948ZM8.8948 13.1297V14.6297H7.3948L7.3848 13.1297H8.8948ZM13.0048 16.7197V18.2197H11.5048L11.4948 16.7197H13.0048ZM13.0048 13.1297V14.6297H11.5048L11.4948 13.1297H13.0048ZM17.1148 16.7197V18.2197H15.6148L15.6048 16.7197H17.1148ZM17.1148 13.1297V14.6297H15.6148L15.6048 13.1297H17.1148ZM3.4248 22.4097H21.0748V11.0097H3.4248V22.4097Z"
      fill={color}
    />
  </Svg>
);

export default CalendarSharpBoldIcon;
