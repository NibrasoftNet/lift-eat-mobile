import * as React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

interface TropicalDrinkEmojiProps {
  size?: number;
}

export const TropicalDrinkEmoji: React.FC<TropicalDrinkEmojiProps> = ({
  size = 100,
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <Defs>
        <LinearGradient
          id="paint0_linear_tropical_glass"
          x1="50"
          y1="30"
          x2="50"
          y2="80"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FFFFFF" stopOpacity="0.7" />
          <Stop offset="1" stopColor="#E0E0E0" stopOpacity="0.7" />
        </LinearGradient>

        <LinearGradient
          id="paint1_linear_tropical_drink"
          x1="50"
          y1="35"
          x2="50"
          y2="75"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#FF9800" />
          <Stop offset="0.3" stopColor="#FF5722" />
          <Stop offset="0.7" stopColor="#E91E63" />
          <Stop offset="1" stopColor="#9C27B0" />
        </LinearGradient>

        <LinearGradient
          id="paint2_linear_umbrella"
          x1="40"
          y1="25"
          x2="40"
          y2="45"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#4CAF50" />
          <Stop offset="1" stopColor="#388E3C" />
        </LinearGradient>

        <LinearGradient
          id="paint3_linear_straw"
          x1="65"
          y1="20"
          x2="65"
          y2="75"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#F44336" />
          <Stop offset="1" stopColor="#D32F2F" />
        </LinearGradient>
      </Defs>

      {/* Verre du cocktail */}
      <Path
        d="M30 30L40 80H60L70 30H30Z"
        fill="url(#paint0_linear_tropical_glass)"
        stroke="#BDBDBD"
        strokeWidth="1"
      />

      {/* Boisson à l'intérieur */}
      <Path
        d="M32.5 35L41.25 75H58.75L67.5 35H32.5Z"
        fill="url(#paint1_linear_tropical_drink)"
      />

      {/* Petit parasol décoratif */}
      <Path
        d="M35 40L45 30L55 40L45 45L35 40Z"
        fill="url(#paint2_linear_umbrella)"
      />

      <Path
        d="M45 30V45"
        stroke="#795548"
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* Paille */}
      <Path
        d="M60 20C60 20 65 25 65 30C65 35 65 75 65 75"
        stroke="url(#paint3_linear_straw)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Tranche d'orange */}
      <Path
        d="M35 32.5C35 32.5 37.5 30 40 30C42.5 30 45 32.5 45 32.5"
        stroke="#FF9800"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <Path
        d="M40 25C40 25 42.5 27.5 40 30C37.5 32.5 40 25 40 25Z"
        fill="#4CAF50"
      />

      {/* Reflets sur le verre */}
      <Path
        d="M35 40C35 40 40 42.5 45 42.5C50 42.5 55 40 55 40"
        stroke="#FFFFFF"
        strokeOpacity="0.5"
        strokeWidth="1"
        strokeLinecap="round"
      />

      <Path
        d="M37.5 60C37.5 60 42.5 62.5 47.5 62.5C52.5 62.5 57.5 60 57.5 60"
        stroke="#FFFFFF"
        strokeOpacity="0.5"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default TropicalDrinkEmoji;
