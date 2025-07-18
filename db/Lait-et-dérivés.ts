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

const LaitEtDerives: MealEntry[] = [
  {
    name: 'Fromage Fondu',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 290,
    carbs: 8.73,
    fat: 21.23,
    protein: 16.41,
    image: '../assets/images/seed/lait_et_derives/fromage_fondu.jpg',
  },
  {
    name: 'Fromage Pâte Dure',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 376,
    carbs: 3.38,
    fat: 27.45,
    protein: 28.43,
    image: '../assets/images/seed/lait_et_derives/fromage_pate_dure.jpg',
  },
  {
    name: 'Lait au Chocolat',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 83,
    carbs: 10.34,
    fat: 3.39,
    protein: 3.17,
    image: '../assets/images/seed/lait_et_derives/lait_au_chocolat.jpg',
  },
  {
    name: 'Lait Concentré Sucré',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 321,
    carbs: 54.4,
    fat: 8.7,
    protein: 7.91,
    image: '../assets/images/seed/lait_et_derives/lait_concentre_sucre.jpg',
  },
  {
    name: 'Lait de Chèvre',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 69,
    carbs: 4.45,
    fat: 4.14,
    protein: 3.56,
    image: '../assets/images/seed/lait_et_derives/lait_de_chevre.jpg',
  },
  {
    name: 'Lait Demi-Écrémé',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 46,
    carbs: 4.7,
    fat: 1.7,
    protein: 3.4,
    image: '../assets/images/seed/lait_et_derives/lait_demi_ecreme.jpg',
  },
  {
    name: 'Lait Écrémé',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 35,
    carbs: 4.85,
    fat: 0.18,
    protein: 3.41,
    image: '../assets/images/seed/lait_et_derives/lait_ecreme.jpg',
  },
  {
    name: 'Lait Entier UHT',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 64,
    carbs: 4.65,
    fat: 3.66,
    protein: 3.28,
    image: '../assets/images/seed/lait_et_derives/lait_entier_uht.jpg',
  },
  {
    name: 'Leben',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 34,
    carbs: 4.85,
    fat: 0.17,
    protein: 3.26,
    image: '../assets/images/seed/lait_et_derives/leben.jpg',
  },
  {
    name: 'Rayeb',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 64,
    carbs: 4.65,
    fat: 3.66,
    protein: 3.28,
    image: '../assets/images/seed/lait_et_derives/rayeb.jpg',
  },
  {
    name: 'Ricotta',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 81,
    carbs: 8.06,
    fat: 0.0,
    protein: 16.13,
    image: '../assets/images/seed/lait_et_derives/ricotta.jpg',
  },
  {
    name: 'Yaourt au Lait Demi-Écrémé, Aromatisé',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 85,
    carbs: 13.8,
    fat: 1.25,
    protein: 4.93,
    image:
      '../assets/images/seed/lait_et_derives/yaourt_au_lait_demi_ecreme_aromatise.jpg',
  },
  {
    name: 'Yaourt au Lait Demi-Écrémé, Nature',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 71,
    carbs: 8.23,
    fat: 1.76,
    protein: 5.88,
    image:
      '../assets/images/seed/lait_et_derives/yaourt_au_lait_demi_ecreme_nature.jpg',
  },
  {
    name: 'Yaourt au Lait Entier, Aromatisé',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 101,
    carbs: 13.53,
    fat: 3.18,
    protein: 4.84,
    image:
      '../assets/images/seed/lait_et_derives/yaourt_au_lait_entier_aromatise.jpg',
  },
  {
    name: 'Yaourt au Lait Entier, aux Fruits',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 113,
    carbs: 18.9,
    fat: 2.7,
    protein: 3.5,
    image:
      '../assets/images/seed/lait_et_derives/yaourt_au_lait_entier_aux_fruits.jpg',
  },
  {
    name: 'Yaourt au Lait Entier, Chocolaté',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 101,
    carbs: 13.52,
    fat: 3.18,
    protein: 4.84,
    image:
      '../assets/images/seed/lait_et_derives/yaourt_au_lait_entier_chocolate.jpg',
  },
];

export default LaitEtDerives;
