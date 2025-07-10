import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ActivityCurvedTwoToneIcon component
 */
export const ActivityCurvedTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M6.91748 14.8533L9.91048 10.9643L13.3245 13.6443L16.2535 9.86426"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M19.6671 2.34961C20.7291 2.34961 21.5891 3.20961 21.5891 4.27161C21.5891 5.33261 20.7291 6.19361 19.6671 6.19361C18.6051 6.19361 17.7451 5.33261 17.7451 4.27161C17.7451 3.20961 18.6051 2.34961 19.6671 2.34961Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M20.7557 9.26873C20.8887 10.1637 20.9497 11.1717 20.9497 12.3027C20.9497 19.2407 18.6377 21.5527 11.6997 21.5527C4.76271 21.5527 2.44971 19.2407 2.44971 12.3027C2.44971 5.36573 4.76271 3.05273 11.6997 3.05273C12.8097 3.05273 13.8007 3.11173 14.6827 3.23973"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ActivityCurvedTwoToneIcon;
