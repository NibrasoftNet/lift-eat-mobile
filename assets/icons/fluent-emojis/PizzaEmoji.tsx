import * as React from 'react';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

interface PizzaEmojiProps {
  size?: number;
}

export const PizzaEmoji: React.FC<PizzaEmojiProps> = ({ size = 100 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <Defs>
        <LinearGradient
          id="paint0_linear_pizza_crust"
          x1="50"
          y1="20"
          x2="50"
          y2="80"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FFECB3" />
          <Stop offset="1" stopColor="#E6A938" />
        </LinearGradient>
        
        <LinearGradient
          id="paint1_linear_pizza_sauce"
          x1="50"
          y1="25"
          x2="50"
          y2="75"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#E57373" />
          <Stop offset="1" stopColor="#C62828" />
        </LinearGradient>
        
        <LinearGradient
          id="paint2_linear_pizza_cheese"
          x1="50"
          y1="30"
          x2="50"
          y2="70"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FFF9C4" />
          <Stop offset="1" stopColor="#FFF176" />
        </LinearGradient>
      </Defs>

      {/* Croûte de la pizza */}
      <Path
        d="M80 70C75 75 66.5 80 50 80C33.5 80 25 75 20 70L50 20L80 70Z"
        fill="url(#paint0_linear_pizza_crust)"
      />
      
      {/* Sauce tomate */}
      <Path
        d="M75 65C71.25 70 62.5 75 50 75C37.5 75 28.75 70 25 65L50 25L75 65Z"
        fill="url(#paint1_linear_pizza_sauce)"
      />
      
      {/* Fromage */}
      <Path
        d="M70 60C67.5 65 60 70 50 70C40 70 32.5 65 30 60L50 30L70 60Z"
        fill="url(#paint2_linear_pizza_cheese)"
      />
      
      {/* Pepperoni */}
      <Circle cx="45" cy="40" r="5" fill="#C62828" />
      <Circle cx="60" cy="50" r="5" fill="#C62828" />
      <Circle cx="40" cy="55" r="5" fill="#C62828" />
      <Circle cx="55" cy="65" r="5" fill="#C62828" />
      
      {/* Basilic */}
      <Path
        d="M35 45C35 45 33 43 35 42C37 41 39 43 39 43"
        stroke="#4CAF50"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M65 42C65 42 63 40 65 39C67 38 69 40 69 40"
        stroke="#4CAF50"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M50 55C50 55 48 53 50 52C52 51 54 53 54 53"
        stroke="#4CAF50"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default PizzaEmoji;
