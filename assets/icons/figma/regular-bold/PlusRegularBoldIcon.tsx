import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PlusRegularBoldIcon component
 */
export const PlusRegularBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M7.33 2.00009H16.66C20.06 2.00009 22 3.92009 22 7.33009V16.6701C22 20.0601 20.07 22.0001 16.67 22.0001H7.33C3.92 22.0001 2 20.0601 2 16.6701V7.33009C2 3.92009 3.92 2.00009 7.33 2.00009ZM12.82 12.8301H15.66C16.12 12.8201 16.49 12.4501 16.49 11.9901C16.49 11.5301 16.12 11.1601 15.66 11.1601H12.82V8.34009C12.82 7.88009 12.45 7.51009 11.99 7.51009C11.53 7.51009 11.16 7.88009 11.16 8.34009V11.1601H8.33C8.11 11.1601 7.9 11.2501 7.74 11.4001C7.59 11.5601 7.5 11.7691 7.5 11.9901C7.5 12.4501 7.87 12.8201 8.33 12.8301H11.16V15.6601C11.16 16.1201 11.53 16.4901 11.99 16.4901C12.45 16.4901 12.82 16.1201 12.82 15.6601V12.8301Z"
      fill={color}
    />
  </Svg>
);

export default PlusRegularBoldIcon;
