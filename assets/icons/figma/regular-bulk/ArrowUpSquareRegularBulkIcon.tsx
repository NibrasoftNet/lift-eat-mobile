import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUpSquareRegularBulkIcon component
 */
export const ArrowUpSquareRegularBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M22 16.084V7.916C22 4.377 19.724 2 16.335 2H7.665C4.276 2 2 4.377 2 7.916V16.084C2 19.622 4.277 22 7.666 22H16.335C19.724 22 22 19.622 22 16.084Z"
      fill={color}
    />
    <Path
      d="M16.2792 11.1445L12.5312 7.37954C12.2492 7.09654 11.7502 7.09654 11.4672 7.37954L7.71918 11.1445C7.42718 11.4385 7.42818 11.9135 7.72218 12.2055C8.01618 12.4975 8.49018 12.4975 8.78318 12.2035L11.2502 9.72654V16.0815C11.2502 16.4965 11.5862 16.8315 12.0002 16.8315C12.4142 16.8315 12.7502 16.4965 12.7502 16.0815V9.72654L15.2162 12.2035C15.3632 12.3505 15.5552 12.4235 15.7482 12.4235C15.9392 12.4235 16.1312 12.3505 16.2772 12.2055C16.5702 11.9135 16.5712 11.4385 16.2792 11.1445Z"
      fill={color}
    />
  </Svg>
);

export default ArrowUpSquareRegularBulkIcon;
