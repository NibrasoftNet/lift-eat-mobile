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

const legumesFraisEtTransformes: MealEntry[] = [
  {
    name: 'Artichaut, Cru',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 47,
    carbs: 8.36,
    fat: 0.15,
    protein: 3.27,
    image:
      '../assets/images/seed/legumes_frais_et_transformes/artichaut_cru.jpg',
  },

  {
    name: 'Aubergine, Crue',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 24,
    carbs: 5.7,
    fat: 0.19,
    protein: 1.01,
    image:
      '../assets/images/seed/legumes_frais_et_transformes/aubergine_crue.jpg',
  },

  {
    name: 'Bette, Crue',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 19,
    carbs: 3.74,
    fat: 0.2,
    protein: 1.8,
    image: '../assets/images/seed/legumes_frais_et_transformes/bette_crue.jpg',
  },

  {
    name: 'Betterave Rouge, Crue',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 43,
    carbs: 9.56,
    fat: 0.17,
    protein: 1.61,
    image:
      '../assets/images/seed/legumes_frais_et_transformes/betterave_rouge_crue.jpg',
  },

  {
    name: 'Cardon, Cru',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 22,
    carbs: 5.33,
    fat: 0.11,
    protein: 0.76,
    image: '../assets/images/seed/legumes_frais_et_transformes/cardon_cru.jpg',
  },

  {
    name: 'Carotte, Crue',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 41,
    carbs: 9.58,
    fat: 0.24,
    protein: 0.93,
    image:
      '../assets/images/seed/legumes_frais_et_transformes/carotte_crue.jpg',
  },

  {
    name: 'Céleri Branche, Cru',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 11,
    carbs: 1.5,
    fat: 0.1,
    protein: 0.9,
    image:
      '../assets/images/seed/legumes_frais_et_transformes/celeri_branche_cru.jpg',
  },

  {
    name: 'Céleri-Rave, Cru',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 14,
    carbs: 2.97,
    fat: 0.17,
    protein: 0.69,
    image:
      '../assets/images/seed/legumes_frais_et_transformes/celeri_rave_cru.jpg',
  },

  {
    name: 'Champignon, Cru',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 22,
    carbs: 3.24,
    fat: 0.34,
    protein: 3.11,
    image:
      '../assets/images/seed/legumes_frais_et_transformes/champignon_cru.jpg',
  },

  {
    name: 'Chou Vert, Cru',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 24,
    carbs: 5.58,
    fat: 0.12,
    protein: 1.44,
    image:
      '../assets/images/seed/legumes_frais_et_transformes/chou_vert_cru.jpg',
  },

  {
    name: 'Chou-Fleur, Cru',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 25,
    carbs: 5.3,
    fat: 0.1,
    protein: 1.98,
    image:
      '../assets/images/seed/legumes_frais_et_transformes/chou_fleur_cru.jpg',
  },

  {
    name: 'Concombre, Cru',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 12,
    carbs: 2.16,
    fat: 0.16,
    protein: 0.59,
    image:
      '../assets/images/seed/legumes_frais_et_transformes/concombre_cru.jpg',
  },

  {
    name: 'Corète Chorchorus Olinopus(Mloukhia)',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 227,
    carbs: 21.92,
    fat: 1.67,
    protein: 31.0,
    image:
      '../assets/images/seed/legumes_frais_et_transformes/corete_chorchorus_olinopus_mloukhia.jpg',
  },

  {
    name: 'Courge, Pulpe, Crue',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 26,
    carbs: 6.5,
    fat: 0.1,
    protein: 1.0,
    image:
      '../assets/images/seed/legumes_frais_et_transformes/courge_pulpe_crue.jpg',
  },

  {
    name: 'Courgette, Crue',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 16,
    carbs: 3.35,
    fat: 0.18,
    protein: 1.21,
    image:
      '../assets/images/seed/legumes_frais_et_transformes/courgette_crue.jpg',
  },

  {
    name: 'Endive, Crue',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 17,
    carbs: 4.0,
    fat: 0.1,
    protein: 0.9,
    image:
      '../assets/images/seed/legumes_frais_et_transformes/endive_crue.jpg',
  },

  {
    name: 'Epinard, Cru',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 23,
    carbs: 3.63,
    fat: 0.39,
    protein: 2.86,
    image:
      '../assets/images/seed/legumes_frais_et_transformes/epinard_cru.jpg',
  },

  {
    name: 'Fenouil, Cru',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 31,
    carbs: 7.29,
    fat: 0.2,
    protein: 1.24,
    image:
      '../assets/images/seed/legumes_frais_et_transformes/fenouil_cru.jpg',
  },

  {
    name: 'Fenouil, Feuille, Cru',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 20,
    carbs: 6.15,
    fat: 0.3,
    protein: 2.43,
    image:
      '../assets/images/seed/legumes_frais_et_transformes/fenouil_feuille_cru.jpg',
  },

  {
    name: 'Fève Fraîche, Crue',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 72,
    carbs: 11.7,
    fat: 0.6,
    protein: 5.6,
    image:
      '../assets/images/seed/legumes_frais_et_transformes/feve_fraiche_crue.jpg',
  },

  {
    name: 'Gombo, Cru',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 31,
    carbs: 7.03,
    fat: 0.1,
    protein: 2.0,
    image: '../assets/images/seed/legumes_frais_et_transformes/gombo_cru.jpg',
  },

  {
    name: 'Haricot Vert, Cru',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 29,
    carbs: 4.7,
    fat: 0.0,
    protein: 1.18,
    image:
      '../assets/images/seed/legumes_frais_et_transformes/haricot_vert_cru.jpg',
  },

  {
    name: 'Laitue, Crue',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 10,
    carbs: 2.09,
    fat: 0.11,
    protein: 0.81,
    image:
      '../assets/images/seed/legumes_frais_et_transformes/laitue_crue.jpg',
  },

  {
    name: 'Navet, Cru',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 28,
    carbs: 6.43,
    fat: 0.1,
    protein: 0.9,
    image: '../assets/images/seed/legumes_frais_et_transformes/navet_cru.jpg',
  },

  {
    name: 'Oignon, Cru',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 42,
    carbs: 10.11,
    fat: 0.08,
    protein: 0.92,
    image: '../assets/images/seed/legumes_frais_et_transformes/oignon_cru.jpg',
  },

  {
    name: 'Persil, Frais',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 36,
    carbs: 6.33,
    fat: 0.79,
    protein: 2.97,
    image:
      '../assets/images/seed/legumes_frais_et_transformes/persil_frais.jpg',
  },

  {
    name: 'Petit Pois, Cru',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 81,
    carbs: 14.46,
    fat: 0.4,
    protein: 5.42,
    image:
      '../assets/images/seed/legumes_frais_et_transformes/petit_pois_cru.jpg',
  },

  {
    name: 'Poireau, Cru',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 61,
    carbs: 14.15,
    fat: 0.3,
    protein: 1.5,
    image:
      '../assets/images/seed/legumes_frais_et_transformes/poireau_cru.jpg',
  },

  {
    name: 'Poivron Vert, Cru',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 20,
    carbs: 4.64,
    fat: 0.17,
    protein: 0.86,
    image:
      '../assets/images/seed/legumes_frais_et_transformes/poivron_vert_cru.jpg',
  },

  {
    name: 'Radis, Cru',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 16,
    carbs: 3.4,
    fat: 0.1,
    protein: 0.68,
    image: '../assets/images/seed/legumes_frais_et_transformes/radis_cru.jpg',
  },

  {
    name: 'Tomate, Concentrée',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 82,
    carbs: 18.91,
    fat: 0.47,
    protein: 4.32,
    image:
      '../assets/images/seed/legumes_frais_et_transformes/tomate_concentree.jpg',
  },

  {
    name: 'Tomate, Crue',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 18,
    carbs: 3.92,
    fat: 0.2,
    protein: 0.88,
    image:
      '../assets/images/seed/legumes_frais_et_transformes/tomate_crue.jpg',
  },
];

export default legumesFraisEtTransformes;
