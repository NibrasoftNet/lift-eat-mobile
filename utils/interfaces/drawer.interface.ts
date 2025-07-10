/**
 * Interfaces pour les services de gestion des drawers
 * Ces interfaces définissent les structures utilisées par les services de drawer
 */

import { MealOrmProps, IngredientStandardOrmProps } from '@/db/schema';
import { MealTypeEnum, CuisineTypeEnum } from '@/utils/enum/meal.enum';

/**
 * Interface pour les repas avec une quantité spécifique
 * Utilisée lors de l'ajout de repas à un plan
 */
export interface MealWithQuantity {
  id: number;
  quantity: number;
  mealType?: MealTypeEnum;
}

/**
 * Interface pour les couleurs de type de repas
 */
export interface MealTypeColor {
  bgColor: string;
  textColor: string;
}

/**
 * Interface pour le service de gestion des drawers de repas
 */
export interface MealDrawerServiceInterface {
  /**
   * Obtient le nom complet d'un type de repas
   * @param type - Le type de repas à convertir
   * @returns Le nom du type de repas en français
   */
  getMealTypeName(type: MealTypeEnum): string;

  /**
   * Obtient les couleurs associées à un type de repas
   * @param type - Le type de repas
   * @returns Les classes de couleur pour l'arrière-plan et le texte
   */
  getMealTypeColor(type: MealTypeEnum): MealTypeColor;

  /**
   * Filtre les repas par type
   * @param meals - La liste des repas à filtrer
   * @param type - Le type de repas à filtrer (optionnel)
   * @returns La liste des repas filtrés
   */
  filterMealsByType(meals: MealOrmProps[], type?: MealTypeEnum): MealOrmProps[];

  /**
   * Filtre les repas par type de cuisine
   * @param meals - La liste des repas à filtrer
   * @param cuisine - Le type de cuisine à filtrer (optionnel)
   * @returns La liste des repas filtrés
   */
  filterMealsByCuisine(
    meals: MealOrmProps[],
    cuisine?: CuisineTypeEnum,
  ): MealOrmProps[];

  /**
   * Ajoute des repas à un plan journalier
   * @param dailyPlanId - L'ID du plan journalier
   * @param planId - L'ID du plan parent
   * @param meals - La liste des repas à ajouter avec leur quantité
   * @returns Une promesse contenant le résultat de l'opération
   */
  addMealsToPlan(
    dailyPlanId: number,
    planId: number,
    meals: MealWithQuantity[],
  ): Promise<{ success: boolean; errors?: string[] }>;
}

/**
 * Interface pour un ingrédient avec un identifiant unique
 * Optimisé pour l'affichage dans les listes d'ingrédients
 */
export interface IngredientWithUniqueId extends IngredientStandardOrmProps {
  /** Identifiant unique pour l’UI (ex: prefix-id-pX-iY) */
  uniqueId: string;
  /** Nom formaté selon les préférences utilisateur */
  displayName: string;
  /** Unité formatée (ex: “g”, “ml”) */
  displayUnit: string;
  /** Flag dérivé pour savoir si une image binaire est présente */
  hasImage: boolean;
  /** Index signature pour autoriser l’ajout de clés temporaires sans casser le typage */
  [key: string]: any;
}

/**
 * Paramètres pour la récupération des ingrédients
 */
export interface GetIngredientsParams {
  searchTerm?: string;
  userId: number;
  pageParam?: number;
  pageSize?: number;
  maxItems?: number;
}

/**
 * Ru00e9sultat de la ru00e9cupu00e9ration des ingru00e9dients
 */
export interface GetIngredientsResult {
  data: IngredientWithUniqueId[];
  nextPage: number | null;
  totalCount?: number;
}

/**
 * Interface pour le service de gestion des drawers d'ingru00e9dients
 */
export interface IngredientDrawerServiceInterface {
  /**
   * Ru00e9cupu00e8re une liste d'ingru00e9dients optimisu00e9e pour l'affichage
   * @param params - Paramu00e8tres de recherche et pagination
   * @returns Une promesse contenant les ingru00e9dients et les informations de pagination
   */
  fetchIngredients(params: GetIngredientsParams): Promise<GetIngredientsResult>;

  /**
   * Méthode optimizeIngredientData supprimée le 13 mai 2025
   * Cette fonctionnalité est désormais implémentée dans ingredientPagesService.getIngredientsForDisplay
   */

  /**
   * Debounce un terme de recherche pour u00e9viter trop d'appels u00e0 l'API
   * @param searchTerm - Le terme de recherche u00e0 debouncer
   * @param callback - La fonction u00e0 appeler avec le terme debouncu00e9
   * @param delay - Le du00e9lai de debounce en ms (par du00e9faut: 300ms)
   */
  debounceSearchTerm(
    searchTerm: string,
    callback: (term: string) => void,
    delay?: number,
  ): void;

  /**
   * Obtient les informations d'affichage d'un ingrédient par son ID
   * @param ingredientId - L'ID de l'ingrédient
   * @returns Les informations d'affichage ou une valeur par défaut si non trouvé
   */
  getIngredientDisplayInfo(ingredientId: number): {
    displayName: string;
    displayUnit: string;
  };

  /**
   * Détermine le type d'élément pour les filtres et l'affichage
   * @param item - L'ingrédient dont on veut obtenir le type
   * @returns Une chaîne de caractères indiquant le type ('ingredient')
   */
  getItemType(item: IngredientWithUniqueId): string;
}

/**
 * Interface pour le service générique de gestion des drawers
 * Fournit des fonctionnalités communes pour tous les composants drawer
 */
export interface DrawerServiceInterface {
  /**
   * Debounce un terme de recherche pour éviter trop d'appels à l'API
   * @param searchTerm - Le terme de recherche à debouncer
   * @param callback - La fonction à appeler avec le terme debouncé
   * @param delay - Le délai de debounce en ms (par défaut: 300ms)
   */
  debounceSearchTerm(
    searchTerm: string,
    callback: (term: string) => void,
    delay?: number,
  ): void;

  /**
   * Génère un identifiant unique pour un élément de liste
   * @param prefix - Le préfixe pour l'identifiant (ex: 'ing' pour ingrédients)
   * @param id - L'ID numérique de l'élément
   * @param pageParam - Indice de la page courante
   * @param index - Indice de l'élément dans la page
   * @returns Un identifiant unique au format 'prefix-id-pX-iY'
   */
  generateUniqueId(
    prefix: string,
    id: number,
    pageParam: number,
    index: number,
  ): string;

  /**
   * Création d'un gestionnaire optimisé pour la fin de liste
   * @param hasNextPage - Indique s'il existe une page suivante
   * @param fetchNextPage - Fonction à appeler pour récupérer la page suivante
   * @returns Une fonction à utiliser comme gestionnaire d'événement
   */
  createEndReachedHandler(
    hasNextPage: boolean | undefined,
    fetchNextPage: () => Promise<any>,
  ): () => void;

  /**
   * Obtenir la configuration optimisée pour FlashList
   * @returns Des paramètres optimisés pour les performances de FlashList
   */
  getFlashListConfig(): {
    estimatedItemSize: number;
    onEndReachedThreshold: number;
    estimatedListSize: { height: number; width: number };
    initialNumToRender: number;
    maxToRenderPerBatch: number;
    windowSize: number;
  };

  /**
   * Transforme un tableau d'éléments pour l'affichage optimal
   * @param items - Les éléments à transformer
   * @param limit - Limite maximum d'éléments à inclure
   * @returns Un tableau d'éléments optimisé pour l'affichage
   */
  optimizeItemsForDisplay<T>(items: T[], limit?: number): T[];
}

/**
 * Interface pour un élément de menu dans le drawer des paramètres utilisateur
 */
export interface MenuItem {
  title: string;
  icon: string;
  tag: string;
}

/**
 * Interface pour le service de gestion du drawer d'options
 */
export interface OptionsDrawerServiceInterface {
  /**
   * Gère l'action de détail/information d'un élément
   * @param itemId - L'ID de l'élément pour lequel obtenir les détails
   * @param callback - Fonction de rappel à exécuter après obtention des détails
   */
  handleDetailAction(itemId: number, callback: () => void): void;

  /**
   * Gère l'action d'édition d'un élément
   * @param itemId - L'ID de l'élément à éditer
   * @param callback - Fonction de rappel à exécuter pour l'édition
   */
  handleEditAction(itemId: number, callback: () => void): void;

  /**
   * Gère l'action de suppression d'un élément
   * @param itemId - L'ID de l'élément à supprimer
   * @param callback - Fonction de rappel à exécuter pour la suppression
   */
  handleDeleteAction(itemId: number, callback: () => void): void;

  /**
   * Vérifie si l'édition est disponible pour un élément
   * @param itemType - Le type d'élément
   * @param itemId - L'ID de l'élément
   * @returns `true` si l'édition est disponible, sinon `false`
   */
  isEditAvailable(itemType: string, itemId: number): boolean;

  /**
   * Vérifie si la suppression est disponible pour un élément
   * @param itemType - Le type d'élément
   * @param itemId - L'ID de l'élément
   * @returns `true` si la suppression est disponible, sinon `false`
   */
  isDeleteAvailable(itemType: string, itemId: number): boolean;
}

/**
 * Interface pour le service de gestion du drawer des paramètres utilisateur
 */
export interface UserSettingsDrawerServiceInterface {
  /**
   * Récupère les données de l'utilisateur par son ID
   * @param userId - L'ID de l'utilisateur
   * @returns Une promesse contenant les données de l'utilisateur ou null en cas d'erreur
   */
  fetchUserData(userId: number): Promise<any | null>;

  /**
   * Génère la liste des éléments du menu des paramètres
   * @returns Un tableau d'éléments de menu avec leurs propriétés
   */
  getMenuItems(): MenuItem[];

  /**
   * Génère l'URL de navigation pour un élément de menu
   * @param tag - Le tag de l'élément de menu
   * @param userId - L'ID de l'utilisateur
   * @returns L'URL de navigation vers la page correspondante
   */
  getNavigationUrl(tag: string, userId: number): string;

  /**
   * Formate le nom d'utilisateur pour l'affichage
   * @param name - Le nom de l'utilisateur
   * @returns Le nom formaté pour l'affichage
   */
  formatUserName(name: string | null | undefined): string;

  /**
   * Génère les initiales de l'utilisateur pour l'avatar
   * @param name - Le nom de l'utilisateur
   * @returns Les initiales formatées pour l'avatar
   */
  getUserInitials(name: string | null | undefined): string;
}

/**
 * Interface pour un élément de menu dans le drawer des paramètres généraux
 */
export interface GeneralSettingsMenuItem {
  title: string;
  icon: string;
  action: string;
}

/**
 * Interface pour le service de gestion du drawer des paramètres généraux
 */
export interface GeneralSettingsDrawerServiceInterface {
  /**
   * Génère la liste des éléments du menu des paramètres généraux
   * @returns Un tableau d'éléments de menu avec leurs propriétés
   */
  getGeneralMenuItems(): GeneralSettingsMenuItem[];

  /**
   * Génère la liste des langues disponibles
   * @returns Un tableau des langues disponibles
   */
  getAvailableLanguages(): Array<{ label: string; value: string }>;

  /**
   * Gère l'action associée à un élément de menu
   * @param action - Le code de l'action à exécuter
   * @param callback - La fonction de callback à exécuter si nécessaire
   */
  handleMenuAction(action: string, callback?: () => void): void;

  /**
   * Gère le changement de langue dans l'application
   * @param languageCode - Le code de la langue à appliquer
   * @returns `true` si la langue a été changée avec succès, sinon `false`
   */
  changeLanguage(languageCode: string): boolean;
}

/**
 * Interface pour le service de gestion de l'authentification dans les drawers
 */
export interface AuthDrawerServiceInterface {
  /**
   * Vérifie le code OTP envoyé à l'utilisateur
   * @param otpCode - Le code OTP à vérifier
   * @returns Une promesse indiquant le succès ou l'échec de la vérification
   */
  verifyOtp(otpCode: string): Promise<{ success: boolean; error?: string }>;

  /**
   * Renvoie un code OTP à l'utilisateur
   * @returns Une promesse indiquant le succès ou l'échec de l'envoi
   */
  resendOtp(): Promise<{ success: boolean; error?: string }>;

  /**
   * Gère la redirection post-authentification
   * @param destinationPath - Le chemin de destination après l'authentification (optionnel)
   * @returns Une promesse vide
   */
  handleAuthSuccess(destinationPath?: string): Promise<void>;

  /**
   * Génère un message de toast pour les résultats d'authentification
   * @param success - Indique si l'opération est un succès
   * @param message - Message à afficher
   */
  showAuthToast(success: boolean, message: string): void;
}
