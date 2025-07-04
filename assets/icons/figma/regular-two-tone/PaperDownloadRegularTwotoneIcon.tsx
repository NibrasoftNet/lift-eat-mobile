import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PaperDownloadRegularTwotoneIcon component
 */
export const PaperDownloadRegularTwotoneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M14.7365 2.76196H8.08449C6.02549 2.76196 4.25049 4.43096 4.25049 6.49096V17.228C4.25049 19.404 5.90849 21.115 8.08449 21.115H16.0725C18.1325 21.115 19.8025 19.288 19.8025 17.228V8.03796L14.7365 2.76196Z" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M12.3907 9.44092C12.3907 9.0267 12.0549 8.69092 11.6407 8.69092C11.2265 8.69092 10.8907 9.0267 10.8907 9.44092V14.1982L9.33379 12.6342C9.04156 12.3407 8.56669 12.3396 8.27313 12.6318C7.97957 12.924 7.97848 13.3989 8.27071 13.6924L11.1087 16.5434C11.2494 16.6848 11.4407 16.7643 11.6402 16.7643C11.8296 16.7643 12.0115 16.6927 12.1499 16.5645C12.1588 16.5563 12.1675 16.5478 12.176 16.5392L15.0107 13.6925C15.303 13.399 15.302 12.9242 15.0085 12.6319C14.7149 12.3396 14.2401 12.3406 13.9478 12.6341L12.3907 14.1978V9.44092Z" fill={color} />
    <Path d="M14.4736 2.75024V5.65924C14.4736 7.07924 15.6226 8.23124 17.0426 8.23424C18.3586 8.23724 19.7056 8.23824 19.7966 8.23224" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default PaperDownloadRegularTwotoneIcon;
