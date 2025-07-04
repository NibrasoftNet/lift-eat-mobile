import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * MessageRegularLightOutlineIcon component
 */
export const MessageRegularLightOutlineIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M11.7767 13.4647C11.1077 13.4647 10.4407 13.2437 9.88273 12.8017L5.39773 9.18574C5.07473 8.92574 5.02473 8.45274 5.28373 8.13074C5.54473 7.80974 6.01673 7.75874 6.33873 8.01774L10.8197 11.6297C11.3827 12.0757 12.1757 12.0757 12.7427 11.6257L17.1787 8.01974C17.5007 7.75674 17.9727 7.80674 18.2347 8.12874C18.4957 8.44974 18.4467 8.92174 18.1257 9.18374L13.6817 12.7957C13.1197 13.2417 12.4477 13.4647 11.7767 13.4647Z"
      fill={color}
    />
    <Path d="M1 2H22.4999V21.5H1V2Z" fill={'white'} />
    <Path
      d="M6.839 20H16.659C16.661 19.998 16.669 20 16.675 20C17.816 20 18.828 19.592 19.604 18.817C20.505 17.92 21 16.631 21 15.188V8.32C21 5.527 19.174 3.5 16.659 3.5H6.841C4.326 3.5 2.5 5.527 2.5 8.32V15.188C2.5 16.631 2.996 17.92 3.896 18.817C4.672 19.592 5.685 20 6.825 20H6.839ZM6.822 21.5C5.279 21.5 3.901 20.94 2.837 19.88C1.652 18.698 1 17.032 1 15.188V8.32C1 4.717 3.511 2 6.841 2H16.659C19.989 2 22.5 4.717 22.5 8.32V15.188C22.5 17.032 21.848 18.698 20.663 19.88C19.6 20.939 18.221 21.5 16.675 21.5H16.659H6.841H6.822Z"
      fill={color}
    />
  </Svg>
);

export default MessageRegularLightOutlineIcon;
