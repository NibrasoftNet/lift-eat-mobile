import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * VolumeUpSharpBulkIcon component
 */
export const VolumeUpSharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M19.9177 4.94754L19.4897 4.33154L18.2577 5.18754L18.6857 5.80254C21.3027 9.57154 21.3027 14.4365 18.6857 18.1975L18.2577 18.8125L19.4887 19.6695L19.9177 19.0535C22.8497 14.8395 22.8497 9.17054 19.9177 4.94754Z"
      fill={color}
    />
    <Path
      d="M17.2312 7.62285L16.8582 6.97185L15.5572 7.71685L15.9292 8.36785C17.2142 10.6128 17.2142 13.3968 15.9302 15.6338L15.5562 16.2838L16.8572 17.0308L17.2312 16.3808C18.7792 13.6838 18.7792 10.3278 17.2312 7.62285Z"
      fill={color}
    />
    <Path
      d="M7.0788 7.5643H2.3848V8.0643C2.3828 10.6883 2.3828 13.3123 2.3848 15.9373V16.4363H7.0788L11.2048 20.0133H12.6678V3.9873H11.2048L7.0788 7.5643Z"
      fill={color}
    />
  </Svg>
);

export default VolumeUpSharpBulkIcon;
