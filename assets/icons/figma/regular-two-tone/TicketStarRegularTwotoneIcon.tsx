import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * TicketStarRegularTwotoneIcon component
 */
export const TicketStarRegularTwotoneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M17.8575 20.4168C19.7325 20.4168 21.2505 18.8978 21.2505 17.0238V14.3238C20.0105 14.3238 19.0105 13.3238 19.0105 12.0848C19.0105 10.8448 20.0105 9.84576 21.2505 9.84576L21.2485 7.14276C21.2485 5.26876 19.7305 3.74976 17.8565 3.74976H6.14449C4.27049 3.74976 2.75149 5.26876 2.75149 7.14276L2.75049 9.93276C3.98949 9.93276 4.98949 10.8448 4.98949 12.0848C4.98949 13.3238 3.98949 14.3238 2.75049 14.3238V17.0238C2.75049 18.8978 4.26849 20.4168 6.14249 20.4168H17.8575Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M11.9998 13.8543L13.7398 14.7693C13.9028 14.8543 14.0938 14.7163 14.0628 14.5353L13.7298 12.5963L15.1388 11.2253C15.2708 11.0963 15.1978 10.8733 15.0158 10.8463L13.0698 10.5633L12.1988 8.79929C12.1178 8.63429 11.8828 8.63429 11.8008 8.79929L10.9298 10.5633L8.98481 10.8463C8.80281 10.8733 8.72981 11.0963 8.86181 11.2253L10.2698 12.5963L9.93681 14.5353C9.90581 14.7163 10.0968 14.8543 10.2598 14.7693L11.9998 13.8543Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default TicketStarRegularTwotoneIcon;
