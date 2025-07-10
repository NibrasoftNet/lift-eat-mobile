import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * WorkCurvedBrokenIcon component
 */
export const WorkCurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 16.5147V13.8867"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M21.1301 11.4756L21.1001 11.4966C18.6801 12.9886 15.4801 13.8896 12.0001 13.8896C9.69907 13.8896 7.52807 13.4976 5.62207 12.8036"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12 21.5515C5.09004 21.5515 2.79004 19.5005 2.79004 13.3485C2.79004 7.19651 5.09004 5.14551 12 5.14551C18.91 5.14551 21.21 7.19651 21.21 13.3485C21.21 18.1845 19.789 20.4865 15.825 21.2495"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.2602 5.36724V4.73724C15.2602 3.47324 14.3402 2.44824 13.2002 2.44824H10.8002C9.66023 2.44824 8.74023 3.47324 8.74023 4.73724V5.36724"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default WorkCurvedBrokenIcon;
