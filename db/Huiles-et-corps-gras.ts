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

const HuilesEtCorpsGras: MealEntry[] = [
  {
    name: "Beurre",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 717,
    carbs: 0.06,
    fat: 81.11,
    protein: 0.85,
    image: "../assets/images/seed/Huiles-et-corps-gras/Beurre.jpg"
  },
  {
    name: "Graisse d'Agneau Crue",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 665,
    carbs: 0.00,
    fat: 70.61,
    protein: 6.65,
    image: "../assets/images/seed/Huiles-et-corps-gras/Graisse_d'Agneau_Crue.jpg"
  },
  {
    name: "Huile de Colza",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 900,
    carbs: 0.00,
    fat: 100.00,
    protein: 0.00,
    image: "../assets/images/seed/Huiles-et-corps-gras/Huile_de_Colza.jpg"
  },
  {
    name: "Huile de Mais",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 900,
    carbs: 0.00,
    fat: 100.00,
    protein: 0.00,
    image: "../assets/images/seed/Huiles-et-corps-gras/Huile_de_Mais.jpg"
  },
  {
    name: "Huile de Soja",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 900,
    carbs: 0.00,
    fat: 100.00,
    protein: 0.00,
    image: "../assets/images/seed/Huiles-et-corps-gras/Huile_de_Soja.jpg"
  },
  {
    name: "Huile de Tournesol",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 900,
    carbs: 0.00,
    fat: 100.00,
    protein: 0.00,
    image: "../assets/images/seed/Huiles-et-corps-gras/Huile_de_Tournesol.jpg"
  },
  {
    name: "Huile d'Olive",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 900,
    carbs: 0.00,
    fat: 100.00,
    protein: 0.00,
    image: "../assets/images/seed/Huiles-et-corps-gras/Huile_d'Olive.jpg"
  },
  {
    name: "Margarine",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 716,
    carbs: 0.90,
    fat: 80.30,
    protein: 0.80,
    image: "../assets/images/seed/Huiles-et-corps-gras/Margarine.jpg"
  },
  {
    name: "Smen",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 689,
    carbs: 1.50,
    fat: 77.30,
    protein: 0.85,
    image: "../assets/images/seed/Huiles-et-corps-gras/Smen.jpg"
  }
];

export default HuilesEtCorpsGras;