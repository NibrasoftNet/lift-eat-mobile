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
    name: "Cervelle d'Agneau Crue",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 122,
    carbs: 0.0,
    fat: 8.58,
    protein: 10.4,
    image: '../assets/images/seed/viandes_et_abats/cervelle_d_agneau_crue.jpg',
  },

  {
    name: 'Cervelle de Veau Crue',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 140,
    carbs: 1.05,
    fat: 10.3,
    protein: 10.86,
    image: '../assets/images/seed/viandes_et_abats/cervelle_de_veau_crue.jpg',
  },

  {
    name: "Foie d'Agneau Cru",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 139,
    carbs: 1.78,
    fat: 5.02,
    protein: 20.38,
    image: '../assets/images/seed/viandes_et_abats/foie_d_agneau_cru.jpg',
  },

  {
    name: 'Foie de Veau Cru',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 135,
    carbs: 3.89,
    fat: 3.63,
    protein: 20.36,
    image: '../assets/images/seed/viandes_et_abats/foie_de_veau_cru.jpg',
  },

  {
    name: 'Patte Crue',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 232,
    carbs: 0.0,
    fat: 16.05,
    protein: 21.94,
    image: '../assets/images/seed/viandes_et_abats/patte_crue.jpg',
  },

  {
    name: "Rognon d'Agneau Cru",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 97,
    carbs: 0.82,
    fat: 2.95,
    protein: 15.74,
    image: '../assets/images/seed/viandes_et_abats/rognon_d_agneau_cru.jpg',
  },

  {
    name: 'Rognon de Bœuf Cru',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 99,
    carbs: 0.29,
    fat: 3.09,
    protein: 17.4,
    image: '../assets/images/seed/viandes_et_abats/rognon_de_b_uf_cru.jpg',
  },

  {
    name: 'Salami',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 151,
    carbs: 0.3,
    fat: 9.4,
    protein: 15.3,
    image: '../assets/images/seed/viandes_et_abats/salami_turkey.jpg',
  },

  {
    name: 'Tripes de Bœuf Crues',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 82,
    carbs: 0.0,
    fat: 3.69,
    protein: 12.07,
    image: '../assets/images/seed/viandes_et_abats/tripes_de_b_uf_crues.jpg',
  },

  {
    name: 'Viande de Lapin Crue',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 136,
    carbs: 0.0,
    fat: 5.55,
    protein: 20.05,
    image: '../assets/images/seed/viandes_et_abats/viande_de_lapin_crue.jpg',
  },

  {
    name: 'Viande de Bœuf Crue',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 180,
    carbs: 0.0,
    fat: 10.62,
    protein: 19.7,
    image: '../assets/images/seed/viandes_et_abats/viande_de_b_uf_crue.jpg',
  },

  {
    name: 'Viande de Chameau Crue',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 267,
    carbs: 0.0,
    fat: 20.3,
    protein: 19.6,
    image: '../assets/images/seed/viandes_et_abats/viande_de_chameau_crue.jpg',
  },

  {
    name: 'Viande de Chèvre Crue',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 109,
    carbs: 0.0,
    fat: 2.31,
    protein: 20.6,
    image: '../assets/images/seed/viandes_et_abats/viande_de_chevre_crue.jpg',
  },

  {
    name: "Viande d'Agneau Crue",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 244,
    carbs: 0.0,
    fat: 18.94,
    protein: 17.19,
    image: '../assets/images/seed/viandes_et_abats/viande_d_agneau_crue.jpg',
  },
];

export default viandesEtAbats;
