import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * UnlockRegularBulkIcon component
 */
export const UnlockRegularBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M8.23918 8.70907V7.36726C8.24934 5.37044 9.92597 3.73939 11.9989 3.73939C13.5841 3.73939 15.0067 4.72339 15.5249 6.19541C15.6976 6.65262 16.2057 6.89017 16.663 6.73213C16.8865 6.66156 17.0694 6.50253 17.171 6.29381C17.2727 6.08508 17.293 5.84654 17.2117 5.62787C16.4394 3.46208 14.3462 2 11.9786 2C8.95048 2 6.48126 4.41626 6.46094 7.38714V8.91084L8.23918 8.70907Z"
      fill={color}
    />
    <Path
      d="M7.7688 8.71106H16.2312C18.5886 8.71106 20.5 10.5807 20.5 12.8866V17.8245C20.5 20.1304 18.5886 22 16.2312 22H7.7688C5.41136 22 3.5 20.1304 3.5 17.8245V12.8866C3.5 10.5807 5.41136 8.71106 7.7688 8.71106ZM11.9949 17.3285C12.4928 17.3285 12.8891 16.9409 12.8891 16.4538V14.2473C12.8891 13.7702 12.4928 13.3826 11.9949 13.3826C11.5072 13.3826 11.1109 13.7702 11.1109 14.2473V16.4538C11.1109 16.9409 11.5072 17.3285 11.9949 17.3285Z"
      fill={color}
    />
  </Svg>
);

export default UnlockRegularBulkIcon;
