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

const PoissonsFruitsDeMer: MealEntry[] = [
  {
    name: "Anchois à l'Huile",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 210,
    carbs: 0,
    fat: 9.71,
    protein: 28.89,
    image: "../assets/images/seed/Poissons-et-fruits-de-mer/Anchois_à_l'Huile.jpg"
  },
  {
    name: "Anchois Frais",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 131,
    carbs: 0,
    fat: 4.84,
    protein: 20.35,
    image: "../assets/images/seed/Poissons-et-fruits-de-mer/Anchois_Frais.jpg"
  },
  {
    name: "Poissans Bleu",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 164,
    carbs: 0,
    fat: 9.19,
    protein: 19.33,
    image: "../assets/images/seed/Poissons-et-fruits-de-mer/Poissons_Bleu.jpg"
  },
  {
    name: "Calamar Cru",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 92,
    carbs: 3.08,
    fat: 1.38,
    protein: 15.58,
    image: "../assets/images/seed/Poissons-et-fruits-de-mer/Calamar_Cru.jpg"
  },
  {
    name: "Calamar Sec",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 350,
    carbs: 11.11,
    fat: 5.25,
    protein: 59.24,
    image: "../assets/images/seed/Poissons-et-fruits-de-mer/Calamar_Sec.jpg"
  },
  {
    name: "Clam Praire ou Palourde Cru",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 74,
    carbs: 2.57,
    fat: 0.97,
    protein: 12.77,
    image: "../assets/images/seed/Poissons-et-fruits-de-mer/Clam_Praire_ou_Palourde_Cru.jpg"
  },
  {
    name: "Crevette Crue",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 106,
    carbs: 0.91,
    fat: 1.73,
    protein: 20.31,
    image: "../assets/images/seed/Poissons-et-fruits-de-mer/Crevette_Crue.jpg"
  },
  {
    name: "Hareng Cru",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 158,
    carbs: 0,
    fat: 9.04,
    protein: 17.96,
    image: "../assets/images/seed/Poissons-et-fruits-de-mer/Hareng_Cru.jpg"
  },
  {
    name: "Loup Cru",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 97,
    carbs: 0,
    fat: 2.33,
    protein: 17.73,
    image: "../assets/images/seed/Poissons-et-fruits-de-mer/Loup_Cru.jpg"
  },
  {
    name: "Poissons Blanc",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 98,
    carbs: 0,
    fat: 2.04,
    protein: 18.60,
    image: "../assets/images/seed/Poissons-et-fruits-de-mer/Poissons_Blanc.jpg"
  },
  {
    name: "Maquereau Cru",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 205,
    carbs: 0,
    fat: 13.89,
    protein: 18.60,
    image: "../assets/images/seed/Poissons-et-fruits-de-mer/Maquereau_Cru.jpg"
  },
  {
    name: "Merlu Cru",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 90,
    carbs: 0,
    fat: 1.31,
    protein: 18.31,
    image: "../assets/images/seed/Poissons-et-fruits-de-mer/Merlu_Cru.jpg"
  },
  {
    name: "Moule Crue",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 86,
    carbs: 3.69,
    fat: 2.24,
    protein: 11.90,
    image: "../assets/images/seed/Poissons-et-fruits-de-mer/Moule_Crue.jpg"
  },
  {
    name: "Mulet Cru",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 117,
    carbs: 0,
    fat: 3.79,
    protein: 19.35,
    image: "../assets/images/seed/Poissons-et-fruits-de-mer/Mulet_Cru.jpg"
  },
  {
    name: "Poulpe Cru",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 82,
    carbs: 2.20,
    fat: 1.04,
    protein: 14.91,
    image: "../assets/images/seed/Poissons-et-fruits-de-mer/Poulpe_Cru.jpg"
  },
  {
    name: "Poulpe Sèche",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 312,
    carbs: 8.37,
    fat: 3.95,
    protein: 56.69,
    image: "../assets/images/seed/Poissons-et-fruits-de-mer/Poulpe_Sèche.jpg"
  },
  {
    name: "Rascasse Crue",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 94,
    carbs: 0,
    fat: 1.57,
    protein: 18.75,
    image: "../assets/images/seed/Poissons-et-fruits-de-mer/Rascasse_Crue.jpg"
  },
  {
    name: "Sardine Conserve",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 208,
    carbs: 0,
    fat: 11.45,
    protein: 24.62,
    image: "../assets/images/seed/Poissons-et-fruits-de-mer/Sardine_Conserve.jpg"
  },
  {
    name: "Sardine Crue",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 163,
    carbs: 0,
    fat: 9.00,
    protein: 20.40,
    image: "../assets/images/seed/Poissons-et-fruits-de-mer/Sardine_Crue.jpg"
  },
  {
    name: "Seiche Crue",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 79,
    carbs: 0.82,
    fat: 0.70,
    protein: 16.24,
    image: "../assets/images/seed/Poissons-et-fruits-de-mer/Seiche_Crue.jpg"
  },
  {
    name: "Sole Crue",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 91,
    carbs: 0,
    fat: 1.19,
    protein: 18.84,
    image: "../assets/images/seed/Poissons-et-fruits-de-mer/Sole_Crue.jpg"
  },
  {
    name: "Thon Conserve",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 186,
    carbs: 0,
    fat: 8.08,
    protein: 26.53,
    image: "../assets/images/seed/Poissons-et-fruits-de-mer/Thon_Conserve.jpg"
  }
];

export default PoissonsFruitsDeMer;