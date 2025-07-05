import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * VoiceRegularBulkIcon component
 */
export const VoiceRegularBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M19.5313 9.82568C18.9966 9.82568 18.5626 10.2533 18.5626 10.7823C18.5626 14.3554 15.6186 17.2627 12.0005 17.2627C8.38136 17.2627 5.43743 14.3554 5.43743 10.7823C5.43743 10.2533 5.00345 9.82568 4.46872 9.82568C3.93398 9.82568 3.5 10.2533 3.5 10.7823C3.5 15.0873 6.79945 18.6412 11.0318 19.1186V21.0434C11.0318 21.5714 11.4648 22 12.0005 22C12.5352 22 12.9692 21.5714 12.9692 21.0434V19.1186C17.2006 18.6412 20.5 15.0873 20.5 10.7823C20.5 10.2533 20.066 9.82568 19.5313 9.82568Z"
      fill={color}
    />
    <Path
      d="M11.8246 15.2171H12.1753C14.5777 15.2171 16.5268 13.2932 16.5268 10.9208V6.29727C16.5268 3.92287 14.5777 2 12.1753 2H11.8246C9.4222 2 7.47314 3.92287 7.47314 6.29727V10.9208C7.47314 13.2932 9.4222 15.2171 11.8246 15.2171Z"
      fill={color}
    />
  </Svg>
);

export default VoiceRegularBulkIcon;
