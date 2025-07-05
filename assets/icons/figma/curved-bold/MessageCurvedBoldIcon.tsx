import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * MessageCurvedBoldIcon component
 */
export const MessageCurvedBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M18.3951 10.0645C18.0431 10.4865 14.8841 14.1875 12.2611 14.1875C9.64107 14.1875 6.45007 10.4895 6.09407 10.0675C5.82807 9.75048 5.86807 9.27748 6.18507 9.01048C6.50107 8.74248 6.97407 8.78448 7.24107 9.10048C8.41207 10.4875 10.8091 12.6875 12.2611 12.6875C13.7121 12.6875 16.0871 10.4895 17.2431 9.10348C17.5081 8.78648 17.9811 8.74448 18.2991 9.00748C18.6171 9.27348 18.6601 9.74648 18.3951 10.0645ZM12.2501 2.91748C4.84907 2.91748 2.22607 5.43348 2.22607 12.5345C2.22607 19.6345 4.84907 22.1515 12.2501 22.1515C19.6511 22.1515 22.2741 19.6345 22.2741 12.5345C22.2741 5.43348 19.6511 2.91748 12.2501 2.91748Z"
      fill={color}
    />
  </Svg>
);

export default MessageCurvedBoldIcon;
