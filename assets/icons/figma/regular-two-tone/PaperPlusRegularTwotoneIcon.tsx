import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PaperPlusRegularTwotoneIcon component
 */
export const PaperPlusRegularTwotoneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M14.7365 2.76196H8.08449C6.02549 2.76196 4.25049 4.43096 4.25049 6.49096V17.34C4.25049 19.516 5.90849 21.115 8.08449 21.115H16.0725C18.1325 21.115 19.8025 19.4 19.8025 17.34V8.03796L14.7365 2.76196Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.5938 10.4644C12.5938 10.0501 12.258 9.71436 11.8438 9.71436C11.4296 9.71436 11.0938 10.0501 11.0938 10.4644V12.1641H9.39355C8.97934 12.1641 8.64355 12.4998 8.64355 12.9141C8.64355 13.3283 8.97934 13.6641 9.39355 13.6641H11.0938V15.3654C11.0938 15.7796 11.4296 16.1154 11.8438 16.1154C12.258 16.1154 12.5938 15.7796 12.5938 15.3654V13.6641H14.2946C14.7088 13.6641 15.0446 13.3283 15.0446 12.9141C15.0446 12.4998 14.7088 12.1641 14.2946 12.1641H12.5938V10.4644Z"
      fill={color}
    />
    <Path
      d="M14.4736 2.75024V5.65924C14.4736 7.07924 15.6226 8.23124 17.0426 8.23424C18.3586 8.23724 19.7056 8.23824 19.7966 8.23224"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default PaperPlusRegularTwotoneIcon;
