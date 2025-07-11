import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ChatSharpBrokenIcon component
 */
export const ChatSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M18.798 5.47389C22.404 9.07989 22.397 14.9229 18.798 18.5229C16.943 20.3779 14.501 21.2759 12.075 21.2239C8.779 21.1529 3 21.2039 3 21.2039L5.025 17.9759C5.025 17.9759 3.048 15.0389 3.048 12.0049C3.046 9.64189 3.946 7.27989 5.752 5.47489C8.001 3.22489 11.129 2.38089 14.038 2.94289"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.0334 12.3809H15.9354"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.2995 12.3809H12.2005"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.56512 12.3809H8.46613"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ChatSharpBrokenIcon;
