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

const SucreEtProduitsSucres: MealEntry[] = [
  {
    name: 'Bonbons',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 379,
    carbs: 95.0,
    fat: 0.0,
    protein: 0.0,
    image: '../assets/images/seed/sucre_et_produits_sucres/bonbons.jpg',
  },
  {
    name: 'Chamia',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 517,
    carbs: 42.73,
    fat: 33.3,
    protein: 11.6,
    image: '../assets/images/seed/sucre_et_produits_sucres/chamia.jpg',
  },
  {
    name: 'Chocolat à Tartiner avec Noisette',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 541,
    carbs: 62.16,
    fat: 29.73,
    protein: 5.41,
    image:
      '../assets/images/seed/sucre_et_produits_sucres/chocolat_a_tartiner_avec_noisette.jpg',
  },
  {
    name: 'Chocolat au Lait',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 535,
    carbs: 59.4,
    fat: 29.66,
    protein: 7.65,
    image:
      '../assets/images/seed/sucre_et_produits_sucres/chocolat_au_lait.jpg',
  },
  {
    name: 'Chocolat Instantané Sucré, en Poudre',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 349,
    carbs: 76.98,
    fat: 3.1,
    protein: 3.3,
    image:
      '../assets/images/seed/sucre_et_produits_sucres/chocolat_instantane_sucre_en_poudre.jpg',
  },
  {
    name: 'Confiture, Tout Type',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 278,
    carbs: 68.86,
    fat: 0.07,
    protein: 0.37,
    image:
      '../assets/images/seed/sucre_et_produits_sucres/confiture_tout_type.jpg',
  },
  {
    name: 'Glace',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 181,
    carbs: 25.57,
    fat: 6.9,
    protein: 4.6,
    image: '../assets/images/seed/sucre_et_produits_sucres/glace.jpg',
  },
  {
    name: 'Miel',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 304,
    carbs: 75.7,
    fat: 0.0,
    protein: 0.3,
    image: '../assets/images/seed/sucre_et_produits_sucres/miel.jpg',
  },
  {
    name: 'Pâte de Fruits',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 214,
    carbs: 56.0,
    fat: 0.0,
    protein: 1.0,
    image: '../assets/images/seed/sucre_et_produits_sucres/pate_de_fruits.jpg',
  },
  {
    name: 'Sirop, Grenadine',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 266,
    carbs: 66.6,
    fat: 0.0,
    protein: 0.0,
    image:
      '../assets/images/seed/sucre_et_produits_sucres/sirop_grenadine.jpg',
  },
  {
    name: 'Soda',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 39,
    carbs: 10.85,
    fat: 0.0,
    protein: 0.0,
    image: '../assets/images/seed/sucre_et_produits_sucres/soda.jpg',
  },
  {
    name: 'Sorbet au Citron',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 92,
    carbs: 23.1,
    fat: 0.0,
    protein: 0.5,
    image:
      '../assets/images/seed/sucre_et_produits_sucres/sorbet_au_citron.jpg',
  },
  {
    name: 'Sucre',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 387,
    carbs: 99.98,
    fat: 0.0,
    protein: 0.0,
    image: '../assets/images/seed/sucre_et_produits_sucres/sucre.jpg',
  },
];

export default SucreEtProduitsSucres;
