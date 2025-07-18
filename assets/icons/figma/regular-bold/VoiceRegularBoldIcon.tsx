import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * VoiceRegularBoldIcon component
 */
export const VoiceRegularBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12.1748 15.2174H11.825C9.42166 15.2174 7.47358 13.2927 7.47358 10.9203V6.29706C7.47358 3.92373 9.42166 2 11.825 2H12.1748C14.5781 2 16.5272 3.92373 16.5272 6.29706V10.9203C16.5272 13.2927 14.5781 15.2174 12.1748 15.2174ZM18.5626 10.7829C18.5626 10.2539 18.9966 9.82626 19.5313 9.82626C20.066 9.82626 20.5 10.2539 20.5 10.7829C20.5 15.0866 17.2006 18.6404 12.9692 19.1178V21.0434C12.9692 21.5714 12.5352 22 12.0005 22C11.4648 22 11.0318 21.5714 11.0318 21.0434V19.1178C6.79945 18.6404 3.5 15.0866 3.5 10.7829C3.5 10.2539 3.93398 9.82626 4.46872 9.82626C5.00345 9.82626 5.43743 10.2539 5.43743 10.7829C5.43743 14.3558 8.38136 17.2629 12.0005 17.2629C15.6186 17.2629 18.5626 14.3558 18.5626 10.7829Z"
      fill={color}
    />
  </Svg>
);

export default VoiceRegularBoldIcon;
