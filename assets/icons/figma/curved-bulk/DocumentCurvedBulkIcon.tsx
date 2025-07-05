import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DocumentCurvedBulkIcon component
 */
export const DocumentCurvedBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.2499 2.25C5.68489 2.25 3.35889 4.802 3.35889 12.001C3.35889 19.199 5.68489 21.751 12.2499 21.751C18.8139 21.751 21.1409 19.199 21.1409 12.001C21.1409 4.802 18.8139 2.25 12.2499 2.25Z"
      fill={color}
    />
    <Path
      d="M8.625 12.6878H15.845C16.259 12.6878 16.595 12.3518 16.595 11.9378C16.595 11.5238 16.259 11.1878 15.845 11.1878H8.625C8.211 11.1878 7.875 11.5238 7.875 11.9378C7.875 12.3518 8.211 12.6878 8.625 12.6878Z"
      fill={color}
    />
    <Path
      d="M8.625 16.4468H15.845C16.259 16.4468 16.595 16.1108 16.595 15.6968C16.595 15.2828 16.259 14.9468 15.845 14.9468H8.625C8.211 14.9468 7.875 15.2828 7.875 15.6968C7.875 16.1108 8.211 16.4468 8.625 16.4468Z"
      fill={color}
    />
    <Path
      d="M11.38 7.42676H8.625C8.211 7.42676 7.875 7.76276 7.875 8.17676C7.875 8.59076 8.211 8.92676 8.625 8.92676H11.38C11.794 8.92676 12.13 8.59076 12.13 8.17676C12.13 7.76276 11.794 7.42676 11.38 7.42676Z"
      fill={color}
    />
  </Svg>
);

export default DocumentCurvedBulkIcon;
