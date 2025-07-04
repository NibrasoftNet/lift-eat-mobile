import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Filter2RegularBulkIcon component
 */
export const Filter2RegularBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M14.5715 13.5941L20.4266 7.72014C20.7929 7.35183 21 6.84877 21 6.32376V4.60099C21 3.52002 20.1423 3 19.0844 3H4.91556C3.85765 3 3 3.52002 3 4.60099V6.3547C3 6.85177 3.18462 7.33087 3.51772 7.69419L8.89711 13.5632C8.9987 13.674 9.14034 13.7368 9.28979 13.7378L14.1915 13.7518C14.3332 13.7528 14.4699 13.6969 14.5715 13.5941Z"
      fill={color}
    />
    <Path
      d="M9.05615 13.6858V20.2904C9.05615 20.5309 9.17728 20.7575 9.37557 20.8873C9.48889 20.9621 9.61978 21.0001 9.75068 21.0001C9.84934 21.0001 9.948 20.9791 10.0398 20.9372L14.0057 19.0886C14.2539 18.9739 14.4131 18.7213 14.4131 18.4429V13.6858H9.05615Z"
      fill={color}
    />
  </Svg>
);

export default Filter2RegularBulkIcon;
