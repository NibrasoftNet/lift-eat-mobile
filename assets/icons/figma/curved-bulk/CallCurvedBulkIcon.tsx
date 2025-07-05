import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CallCurvedBulkIcon component
 */
export const CallCurvedBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M21.4972 16.4116C18.8592 13.2116 17.5442 13.4986 16.0982 14.2016C15.0972 14.6876 14.2332 15.1096 11.9872 12.8626C9.74117 10.6156 10.1622 9.75262 10.6482 8.75362C11.3532 7.30662 11.6392 5.98862 8.43617 3.35162C7.67317 2.72662 6.84117 2.48662 5.97517 2.65462C4.14217 2.99762 2.84717 5.03762 2.84917 5.03762C2.03717 6.17362 0.925165 9.58962 8.09216 16.7576C12.8062 21.4726 15.8972 22.6036 17.7732 22.6036C18.7502 22.6036 19.3962 22.2976 19.7702 22.0286C19.7912 22.0166 21.8492 20.7416 22.1962 18.8726C22.3582 18.0036 22.1232 17.1766 21.4972 16.4116Z"
      fill={color}
    />
  </Svg>
);

export default CallCurvedBulkIcon;
