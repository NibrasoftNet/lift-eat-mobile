import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PaperRegularTwotoneIcon component
 */
export const PaperRegularTwotoneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M14.7365 2.76196H8.08351C6.02451 2.76196 4.24951 4.43096 4.24951 6.49096V17.204C4.24951 19.38 5.90851 21.115 8.08351 21.115H16.0725C18.1325 21.115 19.8015 19.265 19.8015 17.204V8.03796L14.7365 2.76196Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M14.2837 15.5579H8.88672"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.2422 10.6057H8.88623"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M14.4736 2.75024V5.65924C14.4736 7.07924 15.6226 8.23124 17.0416 8.23424C18.3586 8.23724 19.7056 8.23824 19.7966 8.23224"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default PaperRegularTwotoneIcon;
