import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * FilterRegularBulkIcon component
 */
export const FilterRegularBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M10.0833 15.958H3.50777C2.67555 15.958 2 16.6217 2 17.4393C2 18.2559 2.67555 18.9207 3.50777 18.9207H10.0833C10.9155 18.9207 11.5911 18.2559 11.5911 17.4393C11.5911 16.6217 10.9155 15.958 10.0833 15.958Z"
      fill={color}
    />
    <Path
      d="M21.9998 17.3992C21.9998 19.2648 20.4609 20.7777 18.5609 20.7777C16.6621 20.7777 15.1221 19.2648 15.1221 17.3992C15.1221 15.5325 16.6621 14.0195 18.5609 14.0195C20.4609 14.0195 21.9998 15.5325 21.9998 17.3992Z"
      fill={color}
    />
    <Path
      d="M22.0001 6.37855C22.0001 5.56202 21.3246 4.89832 20.4934 4.89832H13.9179C13.0857 4.89832 12.4102 5.56202 12.4102 6.37855C12.4102 7.19617 13.0857 7.85988 13.9179 7.85988H20.4934C21.3246 7.85988 22.0001 7.19617 22.0001 6.37855Z"
      fill={color}
    />
    <Path
      d="M8.87774 6.37856C8.87774 8.24523 7.33886 9.75821 5.43887 9.75821C3.53999 9.75821 2 8.24523 2 6.37856C2 4.51298 3.53999 3 5.43887 3C7.33886 3 8.87774 4.51298 8.87774 6.37856Z"
      fill={color}
    />
  </Svg>
);

export default FilterRegularBulkIcon;
