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

const TheEtCafeEtEau: MealEntry[] = [
  {
    name: 'Café Noir',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 4,
    carbs: 0.76,
    fat: 0.0,
    protein: 0.14,
    image: '../assets/images/seed/the_cafe_et_eau/cafe_noir.jpg',
  },
  {
    name: 'Café, Poudre Soluble',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 2,
    carbs: 0.34,
    fat: 0.0,
    protein: 0.1,
    image: '../assets/images/seed/the_cafe_et_eau/cafe_poudre_soluble.jpg',
  },
  {
    name: 'Eau Minérale, Faiblement Minéralisée',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 0,
    carbs: 0.0,
    fat: 0.0,
    protein: 0.0,
    image:
      '../assets/images/seed/the_cafe_et_eau/eau_minerale_faiblement_mineralisee.jpg',
  },
  {
    name: 'Thé',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 1,
    carbs: 0.3,
    fat: 0.0,
    protein: 0.0,
    image: '../assets/images/seed/the_cafe_et_eau/the.jpg',
  },
];

export default TheEtCafeEtEau;
