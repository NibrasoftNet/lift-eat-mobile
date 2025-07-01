import * as React from 'react';
import Svg, { Path, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';

interface BarChartEmojiProps {
  size?: number;
}

export const BarChartEmoji: React.FC<BarChartEmojiProps> = ({ size = 100 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <Defs>
        <LinearGradient
          id="paint0_linear_barchart"
          x1="20"
          y1="10"
          x2="20"
          y2="80"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#4472C4" />
          <Stop offset="1" stopColor="#2B579A" />
        </LinearGradient>
        
        <LinearGradient
          id="paint1_linear_barchart"
          x1="42"
          y1="30"
          x2="42"
          y2="80"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#ED7D31" />
          <Stop offset="1" stopColor="#B54F18" />
        </LinearGradient>
        
        <LinearGradient
          id="paint2_linear_barchart"
          x1="65"
          y1="50"
          x2="65"
          y2="80"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#70AD47" />
          <Stop offset="1" stopColor="#507E32" />
        </LinearGradient>
        
        <LinearGradient
          id="paint3_linear_barchart"
          x1="88"
          y1="20"
          x2="88"
          y2="80"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FFC000" />
          <Stop offset="1" stopColor="#C7921A" />
        </LinearGradient>
      </Defs>

      {/* Axe X */}
      <Path
        d="M10 80H92C93.1 80 94 79.1 94 78C94 76.9 93.1 76 92 76H10C8.9 76 8 76.9 8 78C8 79.1 8.9 80 10 80Z"
        fill="#333333"
      />
      
      {/* Axe Y */}
      <Path
        d="M12 18C12 16.9 11.1 16 10 16C8.9 16 8 16.9 8 18V78C8 79.1 8.9 80 10 80C11.1 80 12 79.1 12 78V18Z"
        fill="#333333"
      />
      
      {/* Barre 1 */}
      <Rect
        x="12"
        y="20"
        width="16"
        height="56"
        rx="2"
        fill="url(#paint0_linear_barchart)"
      />
      
      {/* Barre 2 */}
      <Rect
        x="34"
        y="40"
        width="16"
        height="36"
        rx="2"
        fill="url(#paint1_linear_barchart)"
      />
      
      {/* Barre 3 */}
      <Rect
        x="57"
        y="55"
        width="16"
        height="21"
        rx="2"
        fill="url(#paint2_linear_barchart)"
      />
      
      {/* Barre 4 */}
      <Rect
        x="80"
        y="30"
        width="16"
        height="46"
        rx="2"
        fill="url(#paint3_linear_barchart)"
      />
    </Svg>
  );
};

export default BarChartEmoji;
