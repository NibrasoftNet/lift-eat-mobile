import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DocumentRegularBulkIcon component
 */
export const DocumentRegularBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M16.191 2H7.81C4.77 2 3 3.78 3 6.83V17.16C3 20.26 4.77 22 7.81 22H16.191C19.28 22 21 20.26 21 17.16V6.83C21 3.78 19.28 2 16.191 2Z"
      fill={color}
    />
    <Path
      d="M8.07996 6.65002V6.66002C7.64896 6.66002 7.29996 7.01002 7.29996 7.44002C7.29996 7.87002 7.64896 8.22002 8.07996 8.22002H11.069C11.5 8.22002 11.85 7.87002 11.85 7.42902C11.85 7.00002 11.5 6.65002 11.069 6.65002H8.07996ZM15.92 12.74H8.07996C7.64896 12.74 7.29996 12.39 7.29996 11.96C7.29996 11.53 7.64896 11.179 8.07996 11.179H15.92C16.35 11.179 16.7 11.53 16.7 11.96C16.7 12.39 16.35 12.74 15.92 12.74ZM15.92 17.31H8.07996C7.77996 17.35 7.48996 17.2 7.32996 16.95C7.16996 16.69 7.16996 16.36 7.32996 16.11C7.48996 15.85 7.77996 15.71 8.07996 15.74H15.92C16.319 15.78 16.62 16.12 16.62 16.53C16.62 16.929 16.319 17.27 15.92 17.31Z"
      fill={color}
    />
  </Svg>
);

export default DocumentRegularBulkIcon;
