import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DocumentRegularLightBorderIcon component
 */
export const DocumentRegularLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M15.7161 16.2234H8.49609"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.7161 12.0369H8.49609"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M11.2511 7.86011H8.49609"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.9085 2.74976C15.9085 2.74976 8.23149 2.75376 8.21949 2.75376C5.45949 2.77076 3.75049 4.58676 3.75049 7.35676V16.5528C3.75049 19.3368 5.47249 21.1598 8.25649 21.1598C8.25649 21.1598 15.9325 21.1568 15.9455 21.1568C18.7055 21.1398 20.4155 19.3228 20.4155 16.5528V7.35676C20.4155 4.57276 18.6925 2.74976 15.9085 2.74976Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default DocumentRegularLightBorderIcon;
