import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PaperUploadRegularTwotoneIcon component
 */
export const PaperUploadRegularTwotoneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M14.7365 2.76196H8.08449C6.02549 2.76196 4.25049 4.43096 4.25049 6.49096V17.228C4.25049 19.404 5.90849 21.115 8.08449 21.115H16.0725C18.1325 21.115 19.8025 19.288 19.8025 17.228V8.03796L14.7365 2.76196Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.1717 8.91098C12.0309 8.76962 11.8397 8.69017 11.6402 8.69019C11.4407 8.6902 11.2494 8.76969 11.1087 8.91107L8.27071 11.7621C7.97848 12.0556 7.97957 12.5305 8.27313 12.8227C8.56669 13.1149 9.04156 13.1139 9.33379 12.8203L10.8907 11.2563V16.0137C10.8907 16.4279 11.2265 16.7637 11.6407 16.7637C12.0549 16.7637 12.3907 16.4279 12.3907 16.0137V11.2567L13.9478 12.8204C14.2401 13.1139 14.7149 13.1149 15.0085 12.8226C15.302 12.5304 15.303 12.0555 15.0107 11.762L12.1717 8.91098Z"
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

export default PaperUploadRegularTwotoneIcon;
