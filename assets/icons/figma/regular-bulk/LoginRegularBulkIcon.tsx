import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * LoginRegularBulkIcon component
 */
export const LoginRegularBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M7.29639 6.446C7.29639 3.995 9.35618 2 11.8878 2H16.9201C19.4456 2 21.5002 3.99 21.5002 6.436V17.552C21.5002 20.004 19.4414 22 16.9098 22H11.8775C9.35205 22 7.29639 20.009 7.29639 17.562V16.622V6.446Z"
      fill={color}
    />
    <Path
      d="M16.0374 11.4538L13.0695 8.54482C12.7627 8.24482 12.2691 8.24482 11.9634 8.54682C11.6587 8.84882 11.6597 9.33582 11.9654 9.63582L13.5905 11.2288H3.2821C2.85042 11.2288 2.5 11.5738 2.5 11.9998C2.5 12.4248 2.85042 12.7688 3.2821 12.7688H13.5905L11.9654 14.3628C11.6597 14.6628 11.6587 15.1498 11.9634 15.4518C12.1168 15.6028 12.3168 15.6788 12.518 15.6788C12.717 15.6788 12.9171 15.6028 13.0695 15.4538L16.0374 12.5448C16.1847 12.3998 16.268 12.2038 16.268 11.9998C16.268 11.7948 16.1847 11.5988 16.0374 11.4538Z"
      fill={color}
    />
  </Svg>
);

export default LoginRegularBulkIcon;
