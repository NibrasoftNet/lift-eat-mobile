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

const CondimentsEtSauces: MealEntry[] = [
  {
    name: "Ail Frais",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 149,
    carbs: 33.06,
    fat: 0.50,
    protein: 6.36,
    image: '../assets/images/seed/Condiments-et-sauces/Ail_Frais.jpg'
  },
  {
    name: "Anis",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 337,
    carbs: 30.88,
    fat: 15.90,
    protein: 17.60,
    image: '../assets/images/seed/Condiments-et-sauces/ANIS.jpg'
  },
  {
    name: "Cannelle, Sèche",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 355,
    carbs: 79.80,
    fat: 2.20,
    protein: 4.50,
    image: '../assets/images/seed/Condiments-et-sauces/Cannelle__Sèche.jpg'
  },
  {
    name: "Câpre",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 23,
    carbs: 4.89,
    fat: 0.86,
    protein: 2.36,
    image: '../assets/images/seed/Condiments-et-sauces/Câpre.jpg'
  },
  {
    name: "Carvi",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 333,
    carbs: 30.65,
    fat: 14.59,
    protein: 19.77,
    image: '../assets/images/seed/Condiments-et-sauces/Carvi.jpg'
  },
  {
    name: "Coriandre",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 298,
    carbs: 22.15,
    fat: 17.77,
    protein: 12.37,
    image: '../assets/images/seed/Condiments-et-sauces/Coriandre.jpg'
  },
  {
    name: "Cornichon au Vinaigre",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 16,
    carbs: 2.20,
    fat: 0.10,
    protein: 0.70,
    image: '../assets/images/seed/Condiments-et-sauces/Cornichon_au_Vinaigre.jpg'
  },
  {
    name: "Cumin, en Poudre",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 445,
    carbs: 40.00,
    fat: 23.20,
    protein: 19.00,
    image: '../assets/images/seed/Condiments-et-sauces/Cumin__en_Poudre.jpg'
  },
  {
    name: "Curcuma, en Poudre",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 354,
    carbs: 58.44,
    fat: 9.88,
    protein: 7.83,
    image: '../assets/images/seed/Condiments-et-sauces/Curcuma__en_Poudre.jpg'
  },
  {
    name: "Curry, en Poudre",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 325,
    carbs: 37.52,
    fat: 13.81,
    protein: 12.66,
    image: '../assets/images/seed/Condiments-et-sauces/curry_vainilla.jpg'
  },
  {
    name: "Gingembre, Moulu",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 347,
    carbs: 64.24,
    fat: 5.95,
    protein: 9.12,
    image: '../assets/images/seed/Condiments-et-sauces/Gingembre__Moulu.jpg'
  },
  {
    name: "Gingembre, Racine",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 80,
    carbs: 17.77,
    fat: 0.75,
    protein: 1.82,
    image: '../assets/images/seed/Condiments-et-sauces/Gingembre__Racine.jpg'
  },
  {
    name: "Levure de Bière, Sèche",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 308,
    carbs: 30.85,
    fat: 0.00,
    protein: 49.35,
    image: '../assets/images/seed/Condiments-et-sauces/Levure_de_Bière__Sèche.jpg'
  },
  {
    name: "Mayonnaise",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 717,
    carbs: 3.90,
    fat: 78.20,
    protein: 1.10,
    image: '../assets/images/seed/Condiments-et-sauces/Mayonnaise.jpg'
  },
  {
    name: "Menthe, Fraîche",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 44,
    carbs: 8.41,
    fat: 0.73,
    protein: 3.29,
    image: '../assets/images/seed/Condiments-et-sauces/Menthe__Fraîche.jpg'
  },
  {
    name: "Menthe, Sèche",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 330,
    carbs: 51.00,
    fat: 2.80,
    protein: 25.20,
    image: '../assets/images/seed/Condiments-et-sauces/Menthe__Sèche.jpg'
  },
  {
    name: "Moutarde",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 113,
    carbs: 10.50,
    fat: 6.30,
    protein: 5.50,
    image: '../assets/images/seed/Condiments-et-sauces/Moutarde.jpg'
  },
  {
    name: "Noix de Muscade",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 525,
    carbs: 43.71,
    fat: 36.31,
    protein: 5.84,
    image: '../assets/images/seed/Condiments-et-sauces/Noix_de_Muscade.jpg'
  },
  {
    name: "Piment Rouge, Moulu",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 318,
    carbs: 28.63,
    fat: 17.27,
    protein: 12.01,
    image: '../assets/images/seed/Condiments-et-sauces/Piment_Rouge__Moulu.jpg'
  },
  {
    name: "Poivre Noir, Moulu",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 255,
    carbs: 45.47,
    fat: 3.26,
    protein: 10.95,
    image: '../assets/images/seed/Condiments-et-sauces/Poivre_Noir__Moulu.jpg'
  },
  {
    name: "Vinaigre",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 14,
    carbs: 5.90,
    fat: 0.00,
    protein: 0.00,
    image: '../assets/images/seed/Condiments-et-sauces/Vinaigre.jpg'
  },
  {
    name: "Thym",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 276,
    carbs: 43.17,
    fat: 7.43,
    protein: 9.11,
    image: '../assets/images/seed/Condiments-et-sauces/Thym.jpg'
  },
  {
    name: "Tomate, Ketchup",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 104,
    carbs: 27.29,
    fat: 0.36,
    protein: 1.52,
    image: '../assets/images/seed/Condiments-et-sauces/Tomate__Ketchup.jpg'
  },
  {
    name: "Sel, Fin",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 0,
    carbs: 0.00,
    fat: 0.00,
    protein: 0.00,
    image: '../assets/images/seed/Condiments-et-sauces/Sel__Fin.jpg'
  }
];

export default CondimentsEtSauces;