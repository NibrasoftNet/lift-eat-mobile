import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PlayCurvedBulkIcon component
 */
export const PlayCurvedBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M12.25 2.85352C5.052 2.85352 2.5 5.40552 2.5 12.6035C2.5 19.8015 5.052 22.3535 12.25 22.3535C19.449 22.3535 22 19.8015 22 12.6035C22 5.40552 19.449 2.85352 12.25 2.85352Z"
      fill={color}
    />
    <Path
      d="M11.0397 16.08C11.3597 16.08 11.7027 15.963 12.0027 15.839C12.7097 15.546 16.0057 13.734 16.0057 12.46C16.0057 11.206 12.7797 9.42902 11.9557 9.08802C11.6217 8.94902 10.8407 8.62802 10.3687 9.09902L10.3681 9.09961C10.2335 9.23521 9.82569 9.64607 9.8147 12.441C9.80271 15.254 10.2294 15.6807 10.3686 15.8199L10.3687 15.82C10.5587 16.01 10.7917 16.08 11.0397 16.08Z"
      fill={color}
    />
  </Svg>
);

export default PlayCurvedBulkIcon;
