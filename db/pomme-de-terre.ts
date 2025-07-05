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

const potatoEntries: MealEntry[] = [
  {
    name: 'Patate Douce, Crue',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 76,
    carbs: 17.61,
    fat: 0.05,
    protein: 1.57,
    image: '../assets/images/seed/pomme-de-terre/Patate_Douce__Crue.jpg',
  },

  {
    name: 'Pom Deterre, Frite',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 310,
    carbs: 37.17,
    fat: 15.93,
    protein: 3.54,
    image: '../assets/images/seed/pomme-de-terre/Pom_Deterre__Frite.jpg',
  },

  {
    name: 'Pomme De Terre, Crue',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 77,
    carbs: 17.47,
    fat: 0.09,
    protein: 2.02,
    image: '../assets/images/seed/pomme-de-terre/Pomme_De_Terre__Crue.jpg',
  },

  {
    name: 'Pomme De Terre, Chips, Salée',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 536,
    carbs: 52.9,
    fat: 34.6,
    protein: 7.0,
    image:
      '../assets/images/seed/pomme-de-terre/Pomme_De_Terre__Chips__Salée.jpg',
  },
];

export default potatoEntries;
