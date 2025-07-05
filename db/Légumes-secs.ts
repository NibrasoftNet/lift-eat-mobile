enum MealUnitEnum {
  GRAMMES = 'GRAMMES',
  MILLILITRES = 'MILLILITRES',
  PIECES = 'PIECES',
}

interface MealEntry {
  name: string;
  unit: MealUnitEnum;
  quantity: number;
  calories: number;
  carbs: number;
  fat: number;
  protein: number;
  image?: string | null;
}

const legumesSecs: MealEntry[] = [
  {
    name: 'Fenugrec, Graines Entières',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 380,
    carbs: 56.0,
    fat: 5.3,
    protein: 26.2,
    image: '../assets/images/seed/Légumes-secs/Fenugrec__Graines_Entières.jpg',
  },

  {
    name: 'Fève Sèche, Crue',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 341,
    carbs: 58.29,
    fat: 1.53,
    protein: 26.12,
    image: '../assets/images/seed/Légumes-secs/Fève_Sèche__Crue.jpg',
  },

  {
    name: 'Haricot Blanc, Sec',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 333,
    carbs: 60.01,
    fat: 0.83,
    protein: 23.58,
    image: '../assets/images/seed/Légumes-secs/Haricot_Blanc_Sec.jpg',
  },

  {
    name: 'Lentille, Sèche',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 338,
    carbs: 57.09,
    fat: 0.96,
    protein: 28.0,
    image: '../assets/images/seed/Légumes-secs/Lentille__Sèche.jpg',
  },

  {
    name: 'Pois Chiche Sec',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 364,
    carbs: 60.65,
    fat: 6.04,
    protein: 19.3,
    image: '../assets/images/seed/Légumes-secs/Pois_Chiche_Sec.jpg',
  },
];

export default legumesSecs;
