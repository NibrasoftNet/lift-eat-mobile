import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PlusRegularLightOutlineIcon component
 */
export const PlusRegularLightOutlineIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M11.75 16.1544C11.336 16.1544 11 15.8184 11 15.4044V8.07739C11 7.66339 11.336 7.32739 11.75 7.32739C12.164 7.32739 12.5 7.66339 12.5 8.07739V15.4044C12.5 15.8184 12.164 16.1544 11.75 16.1544Z"
      fill={color}
    />
    <Path
      d="M15.4165 12.4902H8.0835C7.6685 12.4902 7.3335 12.1542 7.3335 11.7402C7.3335 11.3262 7.6685 10.9902 8.0835 10.9902H15.4165C15.8305 10.9902 16.1665 11.3262 16.1665 11.7402C16.1665 12.1542 15.8305 12.4902 15.4165 12.4902Z"
      fill={color}
    />
    <Path
      d="M7.064 2.5C4.292 2.5 2.5 4.397 2.5 7.335V16.165C2.5 19.103 4.292 21 7.064 21H16.436C19.209 21 21 19.103 21 16.165V7.335C21 4.397 19.209 2.5 16.436 2.5H7.064ZM16.436 22.5H7.064C3.437 22.5 1 19.954 1 16.165V7.335C1 3.546 3.437 1 7.064 1H16.436C20.063 1 22.5 3.546 22.5 7.335V16.165C22.5 19.954 20.063 22.5 16.436 22.5Z"
      fill={color}
    />
  </Svg>
);

export default PlusRegularLightOutlineIcon;
