import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Chat2SharpTwoToneIcon component
 */
export const Chat2SharpTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M18.7981 18.6611C16.943 20.5163 14.5012 21.4147 12.0747 21.3622C8.7795 21.291 3 21.3427 3 21.3427C3 21.3427 3.05068 15.4955 3.04819 12.143C3.04644 9.7805 3.94595 7.41848 5.75162 5.61321C9.35096 2.01255 15.1987 2.01255 18.7981 5.61228C22.4039 9.21851 22.3974 15.0614 18.7981 18.6611Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.0333 12.5196H15.9346"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.2989 12.5196H12.2002"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.56455 12.5196H8.46581"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default Chat2SharpTwoToneIcon;
