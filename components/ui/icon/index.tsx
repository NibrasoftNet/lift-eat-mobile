import React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

type CreateIconOptions = {
  viewBox: string;
  path: React.ReactNode;
};

export function createIcon({ viewBox, path }: CreateIconOptions) {
  type IconProps = SvgProps & {
    size?: number;
    className?: string;
  };

  // Use correct ref type for react-native-svg Svg component
  const Icon = React.forwardRef<Svg, IconProps>(
    ({ size = 24, className, ...props }, ref) => (
      <Svg
        width={size}
        height={size}
        viewBox={viewBox}
        fill="none"
        className={className}
        ref={ref}
        {...props}
      >
        {path}
      </Svg>
    ),
  );
  Icon.displayName = 'Icon';
  return Icon;
}

// The generic Icon component, accepting an icon component in the "as" prop
type IconProps<T extends React.ElementType> = {
  as: T;
  size?: number;
  className?: string;
} & React.ComponentProps<T>;

export function Icon<T extends React.ElementType>({
  as: Component,
  size = 24,
  className,
  ...props
}: IconProps<T>) {
  return (
    <Component width={size} height={size} className={className} {...props} />
  );
}

// Example usage: ArrowLeftIcon
export const ArrowLeftIcon = createIcon({
  viewBox: '0 0 24 24',
  path: (
    <>
      <Path
        d="M19 12H5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 19L5 12L12 5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
});
ArrowLeftIcon.displayName = 'ArrowLeftIcon';

const GoogleIcon = createIcon({
  viewBox: '0 0 48 48',
  path: (
    <>
      <Path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      ></Path>
      <Path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      ></Path>
      <Path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      ></Path>
      <Path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      ></Path>
    </>
  ),
});

GoogleIcon.displayName = 'GoogleIcon';
export { GoogleIcon };
