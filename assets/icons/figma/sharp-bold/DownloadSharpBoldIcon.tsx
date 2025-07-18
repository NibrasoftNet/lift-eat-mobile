import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DownloadSharpBoldIcon component
 */
export const DownloadSharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M13 8.81369V14.1037C13.98 13.0537 15.37 12.3737 16.85 12.3737H17.6V13.8737H16.85C14.83 13.8737 13 15.7037 13 17.7237V18.4737H11.5V17.7237C11.5 15.7037 9.67 13.8737 7.65 13.8737H6.9V12.3737H7.65C9.13 12.3737 10.52 13.0537 11.5 14.1037V8.81369H2.5V21.2437H22V8.81369H13Z"
      fill={color}
    />
    <Path d="M11.5 8.81369H13V3.03369H11.5V8.81369Z" fill={color} />
  </Svg>
);

export default DownloadSharpBoldIcon;
