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
    image: '../assets/images/seed/pomme_de_terre/patate_douce_crue.jpg',
  },

  {
    name: 'Pom Deterre, Frite',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 310,
    carbs: 37.17,
    fat: 15.93,
    protein: 3.54,
    image: '../assets/images/seed/pomme_de_terre/pom_deterre_frite.jpg',
  },

  {
    name: 'Pomme De Terre, Crue',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 77,
    carbs: 17.47,
    fat: 0.09,
    protein: 2.02,
    image: '../assets/images/seed/pomme_de_terre/pomme_de_terre_crue.jpg',
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
      '../assets/images/seed/pomme_de_terre/pomme_de_terre_chips_salee.jpg',
  },
];

export default potatoEntries;
