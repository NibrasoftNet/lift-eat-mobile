import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * HomeCurvedBulkIcon component
 */
export const HomeCurvedBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M19.4991 6.158C19.1361 5.838 18.7231 5.476 18.2311 5.021C18.0081 4.841 17.7641 4.635 17.5051 4.417C16.0451 3.186 14.0451 1.5 12.2221 1.5C10.4201 1.5 8.54906 3.092 7.04606 4.371C6.76806 4.607 6.50806 4.829 6.24306 5.044C5.77706 5.476 5.36406 5.839 5.00006 6.16C2.61306 8.261 2.16406 8.812 2.16406 13.713C2.16406 22.5 4.70506 22.5 12.2501 22.5C19.7941 22.5 22.3361 22.5 22.3361 13.713C22.3361 8.811 21.8871 8.26 19.4991 6.158Z"
      fill={color}
    />
    <Path
      d="M9.34277 16.8848H15.1578C15.5718 16.8848 15.9078 16.5488 15.9078 16.1348C15.9078 15.7208 15.5718 15.3848 15.1578 15.3848H9.34277C8.92877 15.3848 8.59277 15.7208 8.59277 16.1348C8.59277 16.5488 8.92877 16.8848 9.34277 16.8848Z"
      fill={color}
    />
  </Svg>
);

export default HomeCurvedBulkIcon;
