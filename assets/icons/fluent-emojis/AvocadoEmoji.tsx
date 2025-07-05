import * as React from 'react';
import Svg, {
  Path,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
} from 'react-native-svg';

interface AvocadoEmojiProps {
  size?: number;
}

export const AvocadoEmoji: React.FC<AvocadoEmojiProps> = ({ size = 100 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <Defs>
        <LinearGradient
          id="paint0_linear_avocado"
          x1="50"
          y1="20"
          x2="50"
          y2="80"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#62A948" />
          <Stop offset="1" stopColor="#3F7029" />
        </LinearGradient>

        <RadialGradient
          id="paint1_radial_avocado"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(50 50) rotate(90) scale(20)"
        >
          <Stop stopColor="#F7EFC3" />
          <Stop offset="1" stopColor="#E5D28B" />
        </RadialGradient>

        <LinearGradient
          id="paint2_linear_avocado_pit"
          x1="50"
          y1="40"
          x2="50"
          y2="60"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#9C6133" />
          <Stop offset="1" stopColor="#7A4929" />
        </LinearGradient>
      </Defs>

      {/* Corps principal de l'avocat */}
      <Path
        d="M50 20C65.5 20 77.5 33.5 77.5 50C77.5 66.5 65.5 80 50 80C34.5 80 22.5 66.5 22.5 50C22.5 33.5 34.5 20 50 20Z"
        fill="url(#paint0_linear_avocado)"
      />

      {/* Chair de l'avocat */}
      <Path
        d="M50 30C59.5 30 67.5 38.5 67.5 50C67.5 61.5 59.5 70 50 70C40.5 70 32.5 61.5 32.5 50C32.5 38.5 40.5 30 50 30Z"
        fill="url(#paint1_radial_avocado)"
      />

      {/* Noyau de l'avocat */}
      <Path
        d="M50 40C55.5 40 60 44.5 60 50C60 55.5 55.5 60 50 60C44.5 60 40 55.5 40 50C40 44.5 44.5 40 50 40Z"
        fill="url(#paint2_linear_avocado_pit)"
      />

      {/* Détails sur la peau */}
      <Path
        d="M60 25C60 25 65 30 67.5 35C70 40 70 45 70 45C70 45 72.5 37.5 67.5 30C62.5 22.5 60 25 60 25Z"
        fillOpacity="0.7"
        fill="#2E5A1C"
      />

      <Path
        d="M40 25C40 25 35 30 32.5 35C30 40 30 45 30 45C30 45 27.5 37.5 32.5 30C37.5 22.5 40 25 40 25Z"
        fillOpacity="0.7"
        fill="#2E5A1C"
      />
    </Svg>
  );
};

export default AvocadoEmoji;
