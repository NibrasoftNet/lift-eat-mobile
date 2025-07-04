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
    name: "Café Noir",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 4,
    carbs: 0.76,
    fat: 0.00,
    protein: 0.14,
    image: '../assets/images/seed/Thé-café-et-eau/Café_Noir.jpg'
  },
  {
    name: "Café, Poudre Soluble",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 2,
    carbs: 0.34,
    fat: 0.00,
    protein: 0.10,
    image: '../assets/images/seed/Thé-café-et-eau/Café__Poudre_Soluble.jpg'
  },
  {
    name: "Eau Minérale, Faiblement Minéralisée",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 0,
    carbs: 0.00,
    fat: 0.00,
    protein: 0.00,
    image: '../assets/images/seed/Thé-café-et-eau/Eau_Minérale__Faiblement_Minéralisée.jpg'
  },
  {
    name: "Thé",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 1,
    carbs: 0.30,
    fat: 0.00,
    protein: 0.00,
    image: '../assets/images/seed/Thé-café-et-eau/Thé.jpg'
  }
];

export default TheEtCafeEtEau;