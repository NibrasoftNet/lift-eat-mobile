import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CategoryCurvedTwoToneIcon component
 */
export const CategoryCurvedTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M21.0005 17.2617C21.0005 19.2903 19.3553 20.9346 17.3267 20.9346C15.2981 20.9346 13.6538 19.2903 13.6538 17.2617C13.6538 15.2331 15.2981 13.5879 17.3267 13.5879C19.3553 13.5879 21.0005 15.2331 21.0005 17.2617Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M10.3467 17.2617C10.3467 19.2903 8.7024 20.9346 6.6729 20.9346C4.6452 20.9346 3 19.2903 3 17.2617C3 15.2331 4.6452 13.5879 6.6729 13.5879C8.7024 13.5879 10.3467 15.2331 10.3467 17.2617Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M21.0005 6.6738C21.0005 8.7024 19.3553 10.3476 17.3267 10.3476C15.2981 10.3476 13.6538 8.7024 13.6538 6.6738C13.6538 4.6452 15.2981 3 17.3267 3C19.3553 3 21.0005 4.6452 21.0005 6.6738Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M10.3467 6.6738C10.3467 8.7024 8.7024 10.3476 6.6729 10.3476C4.6452 10.3476 3 8.7024 3 6.6738C3 4.6452 4.6452 3 6.6729 3C8.7024 3 10.3467 4.6452 10.3467 6.6738Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default CategoryCurvedTwoToneIcon;
