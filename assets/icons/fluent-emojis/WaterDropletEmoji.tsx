import * as React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

interface WaterDropletEmojiProps {
  size?: number;
}

export const WaterDropletEmoji: React.FC<WaterDropletEmojiProps> = ({
  size = 100,
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <Defs>
        <LinearGradient
          id="paint0_linear_droplet"
          x1="50"
          y1="10"
          x2="50"
          y2="90"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#A4DEFF" />
          <Stop offset="1" stopColor="#0078D4" />
        </LinearGradient>

        <LinearGradient
          id="paint1_linear_droplet"
          x1="35"
          y1="25"
          x2="60"
          y2="55"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FFFFFF" stopOpacity="0.8" />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </LinearGradient>
      </Defs>

      {/* Corps principal de la goutte d'eau */}
      <Path
        d="M50 15C50 15 30 35 30 60C30 75.46 38.954 85 50 85C61.046 85 70 75.46 70 60C70 35 50 15 50 15Z"
        fill="url(#paint0_linear_droplet)"
      />

      {/* Reflet sur la goutte d'eau */}
      <Path
        d="M40 30C40 30 45 40 45 55C45 62 48 65 50 65C52 65 55 62 55 60C55 45 45 35 40 30Z"
        fill="url(#paint1_linear_droplet)"
        fillOpacity="0.6"
      />
    </Svg>
  );
};

export default WaterDropletEmoji;
