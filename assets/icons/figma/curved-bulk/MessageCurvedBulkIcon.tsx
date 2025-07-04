import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * MessageCurvedBulkIcon component
 */
export const MessageCurvedBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M12.2501 2.91797C4.84907 2.91797 2.22607 5.43397 2.22607 12.535C2.22607 19.635 4.84907 22.152 12.2501 22.152C19.6511 22.152 22.2741 19.635 22.2741 12.535C22.2741 5.43397 19.6511 2.91797 12.2501 2.91797Z" fill={color} />
    <Path d="M12.2613 14.1878C14.8843 14.1878 18.0433 10.4868 18.3953 10.0648C18.6603 9.74678 18.6173 9.27377 18.2993 9.00777C17.9813 8.74477 17.5083 8.78678 17.2433 9.10378C16.0873 10.4898 13.7123 12.6878 12.2613 12.6878C10.8093 12.6878 8.41234 10.4878 7.24134 9.10077C6.97434 8.78477 6.50134 8.74278 6.18534 9.01078C5.86834 9.27778 5.82834 9.75077 6.09434 10.0678C6.45034 10.4898 9.64134 14.1878 12.2613 14.1878Z" fill={color} />
  </Svg>
);

export default MessageCurvedBulkIcon;
