import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PasswordCurvedBoldIcon component
 */
export const PasswordCurvedBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M18.01 13.852C18.01 14.266 17.674 14.602 17.26 14.602C16.846 14.602 16.51 14.266 16.51 13.852V12.75H15.182V13.852C15.182 14.266 14.846 14.602 14.432 14.602C14.018 14.602 13.682 14.266 13.682 13.852V12.75H11.566C11.242 13.818 10.259 14.602 9.087 14.602C7.653 14.602 6.486 13.435 6.486 12C6.486 10.566 7.653 9.399 9.087 9.399C10.261 9.4 11.242 10.184 11.566 11.25H17.26C17.674 11.25 18.01 11.586 18.01 12V13.852ZM12.25 2.25C5.052 2.25 2.5 4.802 2.5 12C2.5 19.199 5.052 21.75 12.25 21.75C19.448 21.75 22 19.199 22 12C22 4.802 19.448 2.25 12.25 2.25Z"
      fill={color}
    />
    <Path
      d="M9.08911 10.8988C8.48011 10.8988 7.98511 11.3928 7.98511 12.0008C7.98511 12.6078 8.48011 13.1018 9.08711 13.1018C9.69511 13.1018 10.1901 12.6078 10.1901 12.0008C10.1901 11.3938 9.69611 10.8998 9.08911 10.8988Z"
      fill={color}
    />
  </Svg>
);

export default PasswordCurvedBoldIcon;
