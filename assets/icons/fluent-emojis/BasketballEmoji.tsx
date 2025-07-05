import * as React from 'react';
import Svg, {
  Path,
  Circle,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
} from 'react-native-svg';

interface BasketballEmojiProps {
  size?: number;
}

export const BasketballEmoji: React.FC<BasketballEmojiProps> = ({
  size = 100,
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <Defs>
        <RadialGradient
          id="paint0_radial_basketball"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(50 50) rotate(90) scale(35)"
        >
          <Stop stopColor="#FF9800" />
          <Stop offset="1" stopColor="#E65100" />
        </RadialGradient>

        <LinearGradient
          id="paint1_linear_basketball_highlight"
          x1="35"
          y1="35"
          x2="65"
          y2="65"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FFFFFF" stopOpacity="0.3" />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </LinearGradient>
      </Defs>

      {/* Ballon de basket */}
      <Circle cx="50" cy="50" r="35" fill="url(#paint0_radial_basketball)" />

      {/* Ligne horizontale */}
      <Path
        d="M15 50H85"
        stroke="#000000"
        strokeOpacity="0.7"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Ligne verticale */}
      <Path
        d="M50 15V85"
        stroke="#000000"
        strokeOpacity="0.7"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Courbes supérieures */}
      <Path
        d="M25 25C30 35 40 42.5 50 42.5C60 42.5 70 35 75 25"
        stroke="#000000"
        strokeOpacity="0.7"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Courbes inférieures */}
      <Path
        d="M25 75C30 65 40 57.5 50 57.5C60 57.5 70 65 75 75"
        stroke="#000000"
        strokeOpacity="0.7"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Reflet sur le ballon */}
      <Path
        d="M35 35C40 40 45 45 50 45C55 45 60 40 65 35"
        stroke="url(#paint1_linear_basketball_highlight)"
        strokeWidth="10"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default BasketballEmoji;
