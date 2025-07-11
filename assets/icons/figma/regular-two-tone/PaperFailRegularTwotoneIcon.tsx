import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PaperFailRegularTwotoneIcon component
 */
export const PaperFailRegularTwotoneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M14.7365 2.76196H7.97851C5.91951 2.76196 4.24951 4.43096 4.24951 6.49096V17.34C4.24951 19.516 6.01351 21.115 8.18951 21.115H16.0725C18.1325 21.115 19.8015 19.4 19.8015 17.34V8.03796L14.7365 2.76196Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M10.6407 10.6513C10.3478 10.3584 9.87291 10.3584 9.58002 10.6513C9.28713 10.9442 9.28713 11.4191 9.58002 11.712L10.7828 12.9148L9.58027 14.1173C9.28737 14.4102 9.28737 14.8851 9.58027 15.178C9.87316 15.4709 10.348 15.4709 10.6409 15.178L11.8435 13.9754L13.046 15.178C13.3389 15.4709 13.8138 15.4709 14.1067 15.178C14.3996 14.8851 14.3996 14.4102 14.1067 14.1173L12.9041 12.9148L14.1069 11.712C14.3998 11.4191 14.3998 10.9442 14.1069 10.6513C13.814 10.3584 13.3392 10.3584 13.0463 10.6513L11.8435 11.8541L10.6407 10.6513Z"
      fill={color}
    />
    <Path
      d="M14.4736 2.75024V5.65924C14.4736 7.07924 15.6226 8.23124 17.0416 8.23424C18.3586 8.23724 19.7056 8.23824 19.7966 8.23224"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default PaperFailRegularTwotoneIcon;
