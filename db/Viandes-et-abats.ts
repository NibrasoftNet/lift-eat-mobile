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

const viandesEtAbats: MealEntry[] = [
  {
    name: 'Cervelle d\'Agneau Crue',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 122,
    carbs: 0.00,
    fat: 8.58,
    protein: 10.40,
    image: '../assets/images/seed/Viandes-et-abats/Cervelle_d_Agneau_Crue.jpg',
  },

  {
    name: 'Cervelle de Veau Crue',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 140,
    carbs: 1.05,
    fat: 10.30,
    protein: 10.86,
    image: '../assets/images/seed/Viandes-et-abats/Cervelle_de_Veau_Crue.jpg',
  },

  {
    name: 'Foie d\'Agneau Cru',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 139,
    carbs: 1.78,
    fat: 5.02,
    protein: 20.38,
    image: '../assets/images/seed/Viandes-et-abats/Foie_d_Agneau_Cru.jpg',
  },

  {
    name: 'Foie de Veau Cru',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 135,
    carbs: 3.89,
    fat: 3.63,
    protein: 20.36,
    image: '../assets/images/seed/Viandes-et-abats/Foie_de_Veau_Cru.jpg',
  },

  {
    name: 'Patte Crue',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 232,
    carbs: 0.00,
    fat: 16.05,
    protein: 21.94,
    image: '../assets/images/seed/Viandes-et-abats/Patte_Crue.jpg',
  },

  {
    name: 'Rognon d\'Agneau Cru',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 97,
    carbs: 0.82,
    fat: 2.95,
    protein: 15.74,
    image: '../assets/images/seed/Viandes-et-abats/Rognon_d_Agneau_Cru.jpg',
  },

  {
    name: 'Rognon de Bœuf Cru',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 99,
    carbs: 0.29,
    fat: 3.09,
    protein: 17.40,
    image: '../assets/images/seed/Viandes-et-abats/Rognon_de_Bœuf_Cru.jpg',
  },

  {
    name: 'Salami',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 151,
    carbs: 0.30,
    fat: 9.40,
    protein: 15.30,
    image: '../assets/images/seed/Viandes-et-abats/Salami_Turkey.jpg',
  },

  {
    name: 'Tripes de Bœuf Crues',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 82,
    carbs: 0.00,
    fat: 3.69,
    protein: 12.07,
    image: '../assets/images/seed/Viandes-et-abats/Tripes_de_Bœuf_Crues.jpg',
  },

  {
    name: 'Viande de Lapin Crue',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 136,
    carbs: 0.00,
    fat: 5.55,
    protein: 20.05,
    image: '../assets/images/seed/Viandes-et-abats/Viande_de_Lapin_Crue.jpg',
  },

  {
    name: 'Viande de Bœuf Crue',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 180,
    carbs: 0.00,
    fat: 10.62,
    protein: 19.70,
    image: '../assets/images/seed/Viandes-et-abats/Viande_de_Bœuf_Crue.jpg',
  },

  {
    name: 'Viande de Chameau Crue',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 267,
    carbs: 0.00,
    fat: 20.30,
    protein: 19.60,
    image: '../assets/images/seed/Viandes-et-abats/Viande_de_Chameau_Crue.jpg',
  },

  {
    name: 'Viande de Chèvre Crue',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 109,
    carbs: 0.00,
    fat: 2.31,
    protein: 20.60,
    image: '../assets/images/seed/Viandes-et-abats/Viande_de_Chèvre_Crue.jpg',
  },

  {
    name: 'Viande d\'Agneau Crue',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 244,
    carbs: 0.00,
    fat: 18.94,
    protein: 17.19,
    image: '../assets/images/seed/Viandes-et-abats/Viande-d-Agneau-Crue.jpg',
  },
];

export default viandesEtAbats;