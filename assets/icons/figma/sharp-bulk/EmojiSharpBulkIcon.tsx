import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * EmojiSharpBulkIcon component
 */
export const EmojiSharpBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M12.25 2.38867C6.874 2.38867 2.5 6.76267 2.5 12.1387C2.5 17.5147 6.874 21.8887 12.25 21.8887C17.626 21.8887 22 17.5147 22 12.1387C22 6.76267 17.626 2.38867 12.25 2.38867Z" fill={color} />
    <Path d="M12.25 17.6875C15.006 17.6875 17.248 15.4455 17.248 12.6895V11.9395H15.748V12.6895C15.748 14.6185 14.179 16.1875 12.25 16.1875C10.321 16.1875 8.75195 14.6185 8.75195 12.6895V11.9395H7.25195V12.6895C7.25195 15.4455 9.49395 17.6875 12.25 17.6875Z" fill={color} />
  </Svg>
);

export default EmojiSharpBulkIcon;
