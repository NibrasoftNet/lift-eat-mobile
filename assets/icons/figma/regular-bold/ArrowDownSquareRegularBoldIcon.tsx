import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDownSquareRegularBoldIcon component
 */
export const ArrowDownSquareRegularBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M2 16.0801V7.91009C2 4.38009 4.271 2.00009 7.66 2.00009H16.33C19.72 2.00009 22 4.38009 22 7.91009V16.0801C22 19.6201 19.72 22.0001 16.33 22.0001H7.66C4.271 22.0001 2 19.6201 2 16.0801ZM12.75 14.2701V7.92009C12.75 7.50009 12.41 7.17009 12 7.17009C11.58 7.17009 11.25 7.50009 11.25 7.92009V14.2701L8.78 11.7901C8.64 11.6501 8.44 11.5701 8.25 11.5701C8.061 11.5701 7.87 11.6501 7.72 11.7901C7.43 12.0801 7.43 12.5601 7.72 12.8501L11.47 16.6201C11.75 16.9001 12.25 16.9001 12.53 16.6201L16.28 12.8501C16.57 12.5601 16.57 12.0801 16.28 11.7901C15.98 11.5001 15.51 11.5001 15.21 11.7901L12.75 14.2701Z"
      fill={color}
    />
  </Svg>
);

export default ArrowDownSquareRegularBoldIcon;
