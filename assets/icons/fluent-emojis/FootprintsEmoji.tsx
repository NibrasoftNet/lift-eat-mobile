import * as React from 'react';
import Svg, { Path, Defs, LinearGradient, RadialGradient, Stop } from 'react-native-svg';

interface FootprintsEmojiProps {
  size?: number;
}

export const FootprintsEmoji: React.FC<FootprintsEmojiProps> = ({ size = 100 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <Defs>
        <LinearGradient
          id="paint0_linear_footprints"
          x1="25"
          y1="35"
          x2="25"
          y2="65"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FFD773" />
          <Stop offset="1" stopColor="#EAB253" />
        </LinearGradient>
        
        <RadialGradient
          id="paint1_radial_footprints"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(75 50) rotate(90) scale(20)"
        >
          <Stop stopColor="#FFD773" />
          <Stop offset="1" stopColor="#EAB253" />
        </RadialGradient>
      </Defs>

      {/* Empreinte gauche */}
      <Path
        d="M30 20C28 20 26.5 21 25.5 22.5C24.5 24 24 26 24 28C24 30 24.5 32 25.5 33.5C26.5 35 28 36 30 36C32 36 33.5 35 34.5 33.5C35.5 32 36 30 36 28C36 26 35.5 24 34.5 22.5C33.5 21 32 20 30 20Z"
        fill="url(#paint0_linear_footprints)"
      />
      <Path
        d="M22 25C20.5 25 19.25 25.75 18.5 26.875C17.75 28 17.5 29.5 17.5 31C17.5 32.5 17.75 34 18.5 35.125C19.25 36.25 20.5 37 22 37C23.5 37 24.75 36.25 25.5 35.125C26.25 34 26.5 32.5 26.5 31C26.5 29.5 26.25 28 25.5 26.875C24.75 25.75 23.5 25 22 25Z"
        fill="url(#paint0_linear_footprints)"
      />
      <Path
        d="M14 28C12.9 28 11.95 28.6 11.35 29.5C10.75 30.4 10.5 31.6 10.5 32.8C10.5 34 10.75 35.2 11.35 36.1C11.95 37 12.9 37.6 14 37.6C15.1 37.6 16.05 37 16.65 36.1C17.25 35.2 17.5 34 17.5 32.8C17.5 31.6 17.25 30.4 16.65 29.5C16.05 28.6 15.1 28 14 28Z"
        fill="url(#paint0_linear_footprints)"
      />
      <Path
        d="M8 35C7.2 35 6.5 35.45 6.05 36.1C5.6 36.75 5.4 37.6 5.4 38.5C5.4 39.4 5.6 40.25 6.05 40.9C6.5 41.55 7.2 42 8 42C8.8 42 9.5 41.55 9.95 40.9C10.4 40.25 10.6 39.4 10.6 38.5C10.6 37.6 10.4 36.75 9.95 36.1C9.5 35.45 8.8 35 8 35Z"
        fill="url(#paint0_linear_footprints)"
      />
      <Path
        d="M12 46C11 43 9 41 6 40C5 39.8 4 40.2 3.6 41.1C3.2 42 3.6 43 4.5 43.4C6.4 44.1 7.6 45.3 8.3 47.5C8.8 49 10 50 12 50C14 49.8 15 48 14.5 46.5C14 45 13 44 12 46Z"
        fill="url(#paint0_linear_footprints)"
      />

      {/* Empreinte droite */}
      <Path
        d="M70 50C68 50 66.5 51 65.5 52.5C64.5 54 64 56 64 58C64 60 64.5 62 65.5 63.5C66.5 65 68 66 70 66C72 66 73.5 65 74.5 63.5C75.5 62 76 60 76 58C76 56 75.5 54 74.5 52.5C73.5 51 72 50 70 50Z"
        fill="url(#paint1_radial_footprints)"
      />
      <Path
        d="M62 55C60.5 55 59.25 55.75 58.5 56.875C57.75 58 57.5 59.5 57.5 61C57.5 62.5 57.75 64 58.5 65.125C59.25 66.25 60.5 67 62 67C63.5 67 64.75 66.25 65.5 65.125C66.25 64 66.5 62.5 66.5 61C66.5 59.5 66.25 58 65.5 56.875C64.75 55.75 63.5 55 62 55Z"
        fill="url(#paint1_radial_footprints)"
      />
      <Path
        d="M54 58C52.9 58 51.95 58.6 51.35 59.5C50.75 60.4 50.5 61.6 50.5 62.8C50.5 64 50.75 65.2 51.35 66.1C51.95 67 52.9 67.6 54 67.6C55.1 67.6 56.05 67 56.65 66.1C57.25 65.2 57.5 64 57.5 62.8C57.5 61.6 57.25 60.4 56.65 59.5C56.05 58.6 55.1 58 54 58Z"
        fill="url(#paint1_radial_footprints)"
      />
      <Path
        d="M48 65C47.2 65 46.5 65.45 46.05 66.1C45.6 66.75 45.4 67.6 45.4 68.5C45.4 69.4 45.6 70.25 46.05 70.9C46.5 71.55 47.2 72 48 72C48.8 72 49.5 71.55 49.95 70.9C50.4 70.25 50.6 69.4 50.6 68.5C50.6 67.6 50.4 66.75 49.95 66.1C49.5 65.45 48.8 65 48 65Z"
        fill="url(#paint1_radial_footprints)"
      />
      <Path
        d="M52 76C51 73 49 71 46 70C45 69.8 44 70.2 43.6 71.1C43.2 72 43.6 73 44.5 73.4C46.4 74.1 47.6 75.3 48.3 77.5C48.8 79 50 80 52 80C54 79.8 55 78 54.5 76.5C54 75 53 74 52 76Z"
        fill="url(#paint1_radial_footprints)"
      />
    </Svg>
  );
};

export default FootprintsEmoji;
