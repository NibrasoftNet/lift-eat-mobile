import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeftSquareRegularBulkIcon component
 */
export const ArrowLeftSquareRegularBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M16.084 1.99988L7.916 1.99988C4.377 1.99988 2 4.27588 2 7.66488L2 16.3349C2 19.7239 4.377 21.9999 7.916 21.9999L16.084 21.9999C19.622 21.9999 22 19.7229 22 16.3339L22 7.66488C22 4.27588 19.622 1.99988 16.084 1.99988Z"
      fill={color}
    />
    <Path
      d="M11.1445 7.72057L7.37954 11.4686C7.09654 11.7506 7.09654 12.2496 7.37954 12.5326L11.1445 16.2806C11.4385 16.5726 11.9135 16.5716 12.2055 16.2776C12.4975 15.9836 12.4975 15.5096 12.2035 15.2166L9.72654 12.7496H16.0815C16.4965 12.7496 16.8315 12.4136 16.8315 11.9996C16.8315 11.5856 16.4965 11.2496 16.0815 11.2496L9.72654 11.2496L12.2035 8.78357C12.3505 8.63657 12.4235 8.44457 12.4235 8.25157C12.4235 8.06057 12.3505 7.86857 12.2055 7.72257C11.9135 7.42957 11.4385 7.42857 11.1445 7.72057Z"
      fill={color}
    />
  </Svg>
);

export default ArrowLeftSquareRegularBulkIcon;
