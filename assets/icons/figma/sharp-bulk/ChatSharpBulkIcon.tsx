import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ChatSharpBulkIcon component
 */
export const ChatSharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M19.3579 5.11993C17.5229 3.28493 15.0819 2.27393 12.4819 2.27393C9.88285 2.27393 7.43985 3.28493 5.60485 5.12093C3.76485 6.95993 2.75285 9.40493 2.75485 12.0039C2.75485 14.6399 4.13885 17.1519 4.64085 17.9759L2.29785 21.7119L3.21085 21.7039C3.26885 21.7039 9.02085 21.6539 12.2709 21.7239C12.3439 21.7249 12.4159 21.7259 12.4879 21.7259C15.0839 21.7259 17.5159 20.7189 19.3579 18.8759C23.1499 15.0829 23.1499 8.91293 19.3579 5.11993Z"
      fill={color}
    />
    <Path d="M16.9899 13.1309H15.3919V11.6309H16.9899V13.1309Z" fill={color} />
    <Path d="M13.2559 13.1309H11.6569V11.6309H13.2559V13.1309Z" fill={color} />
    <Path d="M9.52185 13.1309H7.92285V11.6309H9.52185V13.1309Z" fill={color} />
  </Svg>
);

export default ChatSharpBulkIcon;
