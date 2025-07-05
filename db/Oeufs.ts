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

const Oeufs: MealEntry[] = [
  {
    name: "Jaune d'Œuf Cru",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 322,
    carbs: 3.59,
    fat: 26.54,
    protein: 15.86,
    image: "../assets/images/seed/Oeufs/Jaune_d'Œuf_Cru.jpg",
  },
  {
    name: 'Œuf Frais',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 147,
    carbs: 0.86,
    fat: 9.94,
    protein: 12.58,
    image: '../assets/images/seed/Oeufs/Œuf_Frais.jpg',
  },
];

export default Oeufs;
