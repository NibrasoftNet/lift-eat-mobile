import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PaperNegativeCurvedBulkIcon component
 */
export const PaperNegativeCurvedBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M17.26 8.674C15.614 8.674 14.27 7.34 14.27 5.694V3.652L19.552 8.674H17.26ZM20.955 8.85C20.955 8.81 20.955 8.78 20.945 8.74C20.915 8.56 20.885 8.38 20.855 8.21C20.835 8.1 20.785 8.01 20.705 7.93L15.035 2.53C14.965 2.46 14.865 2.41 14.765 2.4C14.595 2.38 14.415 2.36 14.235 2.34C14.205 2.33 14.165 2.33 14.135 2.33C13.555 2.28 12.915 2.25 12.245 2.25C5.68498 2.25 3.35498 4.8 3.35498 12C3.35498 19.19 5.68498 21.75 12.245 21.75C18.815 21.75 21.145 19.19 21.145 12C21.145 10.8 21.085 9.76 20.955 8.85Z"
      fill={color}
    />
    <Path
      d="M9.08057 13.8232H13.9806C14.3946 13.8232 14.7306 13.4882 14.7306 13.0732C14.7306 12.6592 14.3946 12.3232 13.9806 12.3232H9.08057C8.66657 12.3232 8.33057 12.6592 8.33057 13.0732C8.33057 13.4882 8.66657 13.8232 9.08057 13.8232Z"
      fill={color}
    />
  </Svg>
);

export default PaperNegativeCurvedBulkIcon;
