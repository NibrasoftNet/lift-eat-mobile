import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * LockRegularBoldIcon component
 */
export const LockRegularBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M17.5227 7.39601V8.92935C19.2451 9.46696 20.5 11.0261 20.5 12.8884V17.8253C20.5 20.1308 18.5886 22 16.2322 22H7.7688C5.41136 22 3.5 20.1308 3.5 17.8253V12.8884C3.5 11.0261 4.75595 9.46696 6.47729 8.92935V7.39601C6.48745 4.41479 8.95667 2 11.9848 2C15.0535 2 17.5227 4.41479 17.5227 7.39601ZM12.0051 3.73904C14.0678 3.73904 15.7445 5.37871 15.7445 7.39601V8.7137H8.25553V7.37613C8.26569 5.36878 9.94232 3.73904 12.0051 3.73904ZM12.8891 16.4549C12.8891 16.9419 12.4928 17.3294 11.9949 17.3294C11.5072 17.3294 11.1109 16.9419 11.1109 16.4549V14.2488C11.1109 13.7718 11.5072 13.3843 11.9949 13.3843C12.4928 13.3843 12.8891 13.7718 12.8891 14.2488V16.4549Z"
      fill={color}
    />
  </Svg>
);

export default LockRegularBoldIcon;
