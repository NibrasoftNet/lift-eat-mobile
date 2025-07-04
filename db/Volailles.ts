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

const volailles: MealEntry[] = [
  {
    name: 'Foie de Volaille Cru',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 119,
    carbs: 0.73,
    fat: 4.83,
    protein: 16.92,
    image: '../assets/images/seed/Volailles/Foie_de_Volaille_Cru.jpg',
  },

  {
    name: "Blanc de Poulet Cru(sans peau)",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 108,
    carbs: 0.45,
    fat: 1.34,
    protein: 23.5,
    image: '../assets/images/seed/Volailles/Blanc_de_Poulet_Cru(sans_peau).jpg'
  },

  {
    name: "Cuisse de Poulet Crue(sans peau)",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 127,
    carbs: 0.00,
    fat: 5.09,
    protein: 19.06,
    image: '../assets/images/seed/Volailles/Cuisse_de_Poulet_Crue(sans_peau).jpg'
  },

  {
    name: "Blanc de Dinde Cru(sans peau)",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 104,
    carbs: 4.21,
    fat: 1.66,
    protein: 17.07,
    image: '../assets/images/seed/Volailles/Blanc_de_Dinde_Cru(sans_peau).jpg'
  },

  {
    name: "Cuisse de Dinde Crue(sans peau)",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 144,
    carbs: 0.00,
    fat: 6.72,
    protein: 19.54,
    image: '../assets/images/seed/Volailles/Cuisse_de_Dinde_Crue(sans_peau).jpg'
  },

  {
    name: 'Jambon de Dinde',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 131,
    carbs: 1.50,
    fat: 6.34,
    protein: 16.98,
    image: '../assets/images/seed/Volailles/Jambon_de_Dinde.jpg',
  },
];

export default volailles;