import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * GraphSharpBoldIcon component
 */
export const GraphSharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M11.2237 5.24121H10.7237C9.08571 5.24121 7.49971 5.72221 6.13771 6.63221C4.77571 7.54221 3.72471 8.82321 3.09771 10.3362C2.47071 11.8492 2.30871 13.4992 2.62871 15.1052C2.94771 16.7132 3.72871 18.1742 4.88771 19.3312C6.04471 20.4892 7.50571 21.2702 9.11271 21.5902C9.64871 21.6972 10.1887 21.7502 10.7277 21.7502C11.8037 21.7502 12.8727 21.5382 13.8817 21.1202C15.3947 20.4932 16.6767 19.4432 17.5857 18.0812C18.4957 16.7192 18.9767 15.1342 18.9767 13.4952V12.9952H11.2237V5.24121Z"
      fill={color}
    />
    <Path
      d="M19.6139 4.66651C18.0559 3.10751 15.9829 2.24951 13.7779 2.24951H13.2779V11.0025H22.0319V10.5025C22.0319 8.29851 21.1729 6.22651 19.6139 4.66651Z"
      fill={color}
    />
  </Svg>
);

export default GraphSharpBoldIcon;
