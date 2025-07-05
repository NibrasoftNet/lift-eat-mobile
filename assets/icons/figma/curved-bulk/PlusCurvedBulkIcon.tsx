import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PlusCurvedBulkIcon component
 */
export const PlusCurvedBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M12.2497 2.29785C4.6907 2.29785 2.0127 4.97585 2.0127 12.5349C2.0127 20.0939 4.6907 22.7719 12.2497 22.7719C19.8077 22.7719 22.4867 20.0939 22.4867 12.5349C22.4867 4.97585 19.8077 2.29785 12.2497 2.29785Z"
      fill={color}
    />
    <Path
      d="M12.9994 13.2849H15.8274C16.2414 13.2849 16.5774 12.9489 16.5774 12.5349C16.5774 12.1209 16.2414 11.7849 15.8274 11.7849H12.9994V8.96094C12.9994 8.54694 12.6634 8.21094 12.2494 8.21094C11.8354 8.21094 11.4994 8.54694 11.4994 8.96094V11.7849H8.67139C8.25739 11.7849 7.92139 12.1209 7.92139 12.5349C7.92139 12.9489 8.25739 13.2849 8.67139 13.2849H11.4994V16.1089C11.4994 16.5229 11.8354 16.8589 12.2494 16.8589C12.6634 16.8589 12.9994 16.5229 12.9994 16.1089V13.2849Z"
      fill={color}
    />
  </Svg>
);

export default PlusCurvedBulkIcon;
