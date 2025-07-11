import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ChatSharpTwoToneIcon component
 */
export const ChatSharpTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M18.7981 18.5224C16.943 20.3777 14.5012 21.276 12.0747 21.2236C8.7795 21.1523 3 21.2041 3 21.2041L5.02533 17.9753C5.02533 17.9753 3.04819 15.0386 3.04819 12.0043C3.04644 9.64182 3.94595 7.27981 5.75162 5.47454C9.35096 1.87388 15.1987 1.87388 18.7981 5.47361C22.4039 9.07984 22.3974 14.9227 18.7981 18.5224Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.0333 12.3809H15.9346"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.2989 12.3809H12.2002"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.56455 12.3809H8.46581"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ChatSharpTwoToneIcon;
