import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUpRegularLightOutlineIcon component
 */
export const ArrowUpRegularLightOutlineIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M11.7256 20C11.3459 20 11.0321 19.7178 10.9824 19.3518L10.9756 19.25L10.9756 4.25C10.9756 3.83579 11.3114 3.5 11.7256 3.5C12.1053 3.5 12.4191 3.78215 12.4687 4.14823L12.4756 4.25L12.4756 19.25C12.4756 19.6642 12.1398 20 11.7256 20Z"
      fill={color}
    />
    <Path
      d="M6.23296 10.829C5.9407 11.1225 5.46582 11.1235 5.1723 10.8313C4.90546 10.5656 4.88036 10.149 5.09758 9.85489L5.17002 9.77062L11.194 3.72062C11.4605 3.45298 11.8786 3.42863 12.1727 3.64759L12.2569 3.72057L18.2819 9.77057C18.5742 10.0641 18.5732 10.5389 18.2797 10.8312C18.0129 11.0969 17.5962 11.1203 17.303 10.9018L17.2191 10.829L11.7252 5.313L6.23296 10.829Z"
      fill={color}
    />
  </Svg>
);

export default ArrowUpRegularLightOutlineIcon;
