import * as React from 'react';
import Svg, {
  Path,
  Circle,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
} from 'react-native-svg';

interface VolleyballEmojiProps {
  size?: number;
}

export const VolleyballEmoji: React.FC<VolleyballEmojiProps> = ({
  size = 100,
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <Defs>
        <RadialGradient
          id="paint0_radial_volleyball"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(50 50) rotate(90) scale(35)"
        >
          <Stop stopColor="#FFFFFF" />
          <Stop offset="1" stopColor="#F5F5F5" />
        </RadialGradient>

        <LinearGradient
          id="paint1_linear_volleyball_highlight"
          x1="35"
          y1="35"
          x2="65"
          y2="65"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FFFFFF" />
          <Stop offset="1" stopColor="#E0E0E0" />
        </LinearGradient>
      </Defs>

      {/* Ballon de volleyball */}
      <Circle
        cx="50"
        cy="50"
        r="35"
        fill="url(#paint0_radial_volleyball)"
        stroke="#E0E0E0"
        strokeWidth="1"
      />

      {/* Lignes du ballon de volleyball */}
      <Path
        d="M50 15C40 25 35 37.5 35 50C35 62.5 40 75 50 85"
        stroke="#1976D2"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <Path
        d="M50 15C60 25 65 37.5 65 50C65 62.5 60 75 50 85"
        stroke="#1976D2"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <Path
        d="M22.5 30C35 35 47.5 35 60 30C72.5 25 80 25 85 30"
        stroke="#1976D2"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <Path
        d="M15 70C27.5 65 40 65 52.5 70C65 75 77.5 72.5 85 65"
        stroke="#1976D2"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <Path
        d="M15 30C22.5 35 30 45 32.5 55C35 65 40 75 50 82.5"
        stroke="#1976D2"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <Path
        d="M85 30C77.5 35 70 45 67.5 55C65 65 60 75 50 82.5"
        stroke="#1976D2"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Reflet sur le ballon */}
      <Path
        d="M35 35C40 40 45 42.5 50 42.5C55 42.5 60 40 65 35"
        stroke="url(#paint1_linear_volleyball_highlight)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeOpacity="0.5"
      />
    </Svg>
  );
};

export default VolleyballEmoji;
