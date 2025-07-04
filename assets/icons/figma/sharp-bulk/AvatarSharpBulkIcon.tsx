import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * AvatarSharpBulkIcon component
 */
export const AvatarSharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M12.25 2.38867C6.874 2.38867 2.5 6.76267 2.5 12.1387C2.5 17.5147 6.874 21.8887 12.25 21.8887C17.626 21.8887 22 17.5147 22 12.1387C22 6.76267 17.626 2.38867 12.25 2.38867Z"
      fill={color}
    />
    <Path
      d="M15.8956 12.0629H17.3956V10.5629H15.8856L15.8956 12.0629Z"
      fill={color}
    />
    <Path
      d="M9.52762 15.9609H14.2936V14.4609H10.6846L12.6176 7.90889L11.1786 7.48389L8.95762 15.0129L9.52762 15.9609Z"
      fill={color}
    />
    <Path
      d="M6.44262 12.0629H7.94262V10.5629H6.43262L6.44262 12.0629Z"
      fill={color}
    />
  </Svg>
);

export default AvatarSharpBulkIcon;
