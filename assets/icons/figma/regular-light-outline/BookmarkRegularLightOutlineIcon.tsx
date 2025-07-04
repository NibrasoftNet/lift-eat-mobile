import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * BookmarkRegularLightOutlineIcon component
 */
export const BookmarkRegularLightOutlineIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path d="M3 2H20.0388V22.8467H3V2Z" fill={'white'} />
    <Path
      d="M8.342 3.5C5.793 3.5 4.5 4.482 4.5 6.421V21.145C4.5 21.239 4.554 21.29 4.599 21.316C4.644 21.344 4.715 21.364 4.797 21.318L11.179 17.738C11.407 17.611 11.686 17.61 11.915 17.739L18.242 21.313C18.325 21.361 18.396 21.339 18.441 21.312C18.486 21.285 18.539 21.234 18.539 21.14V6.604C18.539 5.837 18.539 3.5 14.701 3.5H8.342ZM4.699 22.847C4.404 22.847 4.109 22.768 3.841 22.61C3.314 22.303 3 21.754 3 21.145V6.421C3 3.611 4.947 2 8.342 2H14.701C18.093 2 20.039 3.679 20.039 6.604V21.14C20.039 21.75 19.725 22.299 19.197 22.606C18.671 22.914 18.037 22.92 17.505 22.62L11.545 19.253L5.53 22.627C5.27 22.773 4.985 22.847 4.699 22.847Z"
      fill={color}
    />
    <Path
      d="M15.1398 10.2285H7.82178C7.40778 10.2285 7.07178 9.89252 7.07178 9.47852C7.07178 9.06452 7.40778 8.72852 7.82178 8.72852H15.1398C15.5538 8.72852 15.8898 9.06452 15.8898 9.47852C15.8898 9.89252 15.5538 10.2285 15.1398 10.2285Z"
      fill={color}
    />
  </Svg>
);

export default BookmarkRegularLightOutlineIcon;
