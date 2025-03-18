import React, { useState, useEffect, useCallback } from 'react';
import { RefreshControl, Platform, View, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Pressable } from '@/components/ui/pressable';
import { Spinner } from '@/components/ui/spinner';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallbackText } from '@/components/ui/avatar';
import { Divider } from '@/components/ui/divider';
import { Input, InputField, InputIcon } from '@/components/ui/input';
import { SearchIcon, Icon } from '@/components/ui/icon';
import { Select, SelectTrigger, SelectInput, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicatorWrapper, SelectDragIndicator, SelectItem } from '@/components/ui/select';
import { saveScannedProductAsIngredient } from '@/utils/services/ingredient.service';
import OpenFoodFactsService, { Product, SearchParams } from '@/utils/api/OpenFoodFactsService';
import SearchCacheService from '@/utils/services/SearchCacheService';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import { debounce } from 'lodash';
import { CircleChevronLeft, FilterIcon } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Heading } from '@/components/ui/heading';

// Nombre d'éléments par page
const ITEMS_PER_PAGE = 20;

export default function Search() {
    const router = useRouter();
    const drizzleDb = useDrizzleDb();
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    
    // Filtres
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [categories, setCategories] = useState<string[]>([]);
    const [brands, setBrands] = useState<string[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [loadingBrands, setLoadingBrands] = useState(false);

    // Charger les catégories et marques au montage du composant
    useEffect(() => {
        const loadFilters = async () => {
            try {
                setLoadingCategories(true);
                setLoadingBrands(true);
                
                // Charger les catégories
                const categoriesData = await OpenFoodFactsService.getCategories();
                if (categoriesData && categoriesData.tags) {
                    // Extraire les 20 premières catégories les plus populaires
                    const topCategories = categoriesData.tags
                        .slice(0, 20)
                        .map((tag: any) => tag.name || tag.id);
                    setCategories(topCategories);
                }
                
                // Charger les marques
                const brandsData = await OpenFoodFactsService.getBrands();
                if (brandsData && brandsData.tags) {
                    // Extraire les 20 premières marques les plus populaires
                    const topBrands = brandsData.tags
                        .slice(0, 20)
                        .map((tag: any) => tag.name || tag.id);
                    setBrands(topBrands);
                }
            } catch (error) {
                console.error('Erreur lors du chargement des filtres:', error);
            } finally {
                setLoadingCategories(false);
                setLoadingBrands(false);
            }
        };
        
        loadFilters();
    }, []);

    // Fonction de recherche debounced pour les suggestions
    const debouncedGetSuggestions = useCallback(
        debounce(async (term: string) => {
            if (term.length < 2) {
                setSuggestions([]);
                setShowSuggestions(false);
                return;
            }
            
            try {
                const suggestionsResult = await OpenFoodFactsService.getAutocompleteSuggestions(term);
                setSuggestions(suggestionsResult);
                setShowSuggestions(suggestionsResult.length > 0);
            } catch (error) {
                console.error('Erreur lors de la récupération des suggestions:', error);
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300),
        []
    );

    // Fonction pour effectuer la recherche
    const performSearch = async (term: string, page = 1, refreshing = false) => {
        if (term.length < 2) return;
        
        if (!refreshing) {
            setLoading(true);
        }
        
        // Préparer les filtres
        const filters: Record<string, string> = {};
        if (selectedCategory) filters.categories = selectedCategory;
        if (selectedBrand) filters.brands = selectedBrand;
        
        // Désactiver temporairement le cache pour tester
        /* 
        // Vérifier si les résultats sont dans le cache
        const cacheKey = term;
        const cachedResults = SearchCacheService.getCachedResults(cacheKey, filters);
        
        if (cachedResults && page === 1 && !refreshing) {
            setSearchResults(cachedResults);
            setTotalPages(Math.ceil(cachedResults.length / ITEMS_PER_PAGE));
            setCurrentPage(1);
            setLoading(false);
            return;
        }
        */
        
        try {
            // Préparer les paramètres de recherche
            const searchParams: SearchParams = {
                search_terms: term,
                page,
                page_size: ITEMS_PER_PAGE,
                sort_by: 'popularity',
            };
            
            // Ajouter les filtres si sélectionnés
            if (selectedCategory) searchParams.categories = selectedCategory;
            if (selectedBrand) searchParams.brands = selectedBrand;
            
            console.log('Recherche avec les paramètres:', JSON.stringify(searchParams));
            
            // Effectuer la recherche
            const response = await OpenFoodFactsService.searchProducts(searchParams);
            
            if (response && response.products) {
                console.log(`Nombre de résultats trouvés: ${response.products.length}`);
                setSearchResults(response.products);
                
                // Calculer le nombre total de pages
                const totalCount = response.count || 0;
                const calculatedTotalPages = Math.ceil(totalCount / ITEMS_PER_PAGE) || 1;
                setTotalPages(calculatedTotalPages);
                
                // Mettre à jour la page courante
                setCurrentPage(page);
                
                // Mettre en cache les résultats de la première page uniquement
                if (page === 1) {
                    // Désactiver temporairement la mise en cache
                    // SearchCacheService.cacheResults(cacheKey, response.products, filters);
                }
            } else {
                setSearchResults([]);
                setTotalPages(1);
                setCurrentPage(1);
            }
        } catch (error) {
            console.error('Erreur lors de la recherche:', error);
            setSearchResults([]);
            setTotalPages(1);
            setCurrentPage(1);
        } finally {
            setLoading(false);
            if (refreshing) {
                setRefreshing(false);
            }
        }
    };

    // Gestionnaire pour le changement du terme de recherche
    const handleSearchTermChange = (text: string) => {
        setSearchTerm(text);
        debouncedGetSuggestions(text);
    };

    // Gestionnaire pour sélectionner une suggestion
    const handleSelectSuggestion = (suggestion: string) => {
        setSearchTerm(suggestion);
        setShowSuggestions(false);
        performSearch(suggestion, 1);
    };

    // Gestionnaire pour changer de page
    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        performSearch(searchTerm, newPage);
    };

    // Gestionnaire pour le rafraîchissement
    const onRefresh = () => {
        setRefreshing(true);
        performSearch(searchTerm, 1, true);
    };

    // Gestionnaire pour sélectionner un produit
    const handleSelectProduct = (product: Product) => {
        setSelectedProduct(product);
    };

    // Gestionnaire pour ajouter un produit à un repas
    const handleAddToMeal = async (product: Product) => {
        try {
            setLoading(true);
            
            // Convertir et sauvegarder le produit comme ingrédient
            await saveScannedProductAsIngredient(drizzleDb, product);
            
            // Naviguer vers l'écran de création de repas avec l'ID de l'ingrédient
            router.push({
                pathname: "/meals/my-meals/create",
                params: {
                    ingredientStandardId: product.code || String(Math.floor(Math.random() * 100000))
                }
            });
        } catch (error) {
            console.error('Erreur lors de l\'ajout au repas:', error);
        } finally {
            setLoading(false);
        }
    };

    // Gestionnaire pour appliquer les filtres
    const applyFilters = () => {
        performSearch(searchTerm, 1);
    };

    // Gestionnaire pour réinitialiser les filtres
    const resetFilters = () => {
        setSelectedCategory('');
        setSelectedBrand('');
        performSearch(searchTerm, 1);
    };

    // Rendu d'un élément de la liste des résultats
    const renderProductItem = ({ item, index }: { item: Product; index: number }) => {
        // Fonctions utilitaires pour afficher les valeurs nutritionnelles en toute sécurité
        const formatNutrientValue = (value: number | null | undefined): string => {
            if (typeof value === 'number') {
                return value.toFixed(1);
            }
            return '0';
        };

        const getEnergyValue = (energy: number | null | undefined): string => {
            if (typeof energy === 'number') {
                return Math.round(energy).toString();
            }
            return '0';
        };

        return (
            <Animated.View
                entering={FadeInUp.delay(index * 100)}
                className="rounded-xl overflow-hidden mb-2"
            >
                <Card
                    className={`w-full items-center gap-2 p-2 bg-white`}
                >
                    <HStack className="w-full items-center justify-between">
                        <HStack className="flex-1 items-center gap-2">
                            <Box className="flex-col items-center justify-center w-16 h-16">
                                <Avatar>
                                    <AvatarFallbackText>
                                        {(item.product_name || 'Prod').slice(0, 2).toUpperCase()}
                                    </AvatarFallbackText>
                                    {item.image_url ? (
                                        <AvatarImage
                                            className="border-2 border-tertiary-500 w-16 h-16 shadow-md"
                                            source={{ uri: item.image_url }}
                                        />
                                    ) : (
                                        <Icon as={SearchIcon} size="lg" className="stroke-white" />
                                    )}
                                </Avatar>
                            </Box>
                            <VStack className="flex-1">
                                <Text className="text-xl font-bold">{item.product_name || 'Produit sans nom'}</Text>
                                <Text className="text-sm">
                                    {item.brands || 'Marque inconnue'} • {item.nutriscore_grade ? 
                                        <Text className="uppercase">{`Nutriscore ${item.nutriscore_grade.toUpperCase()}`}</Text> : 
                                        'Sans nutriscore'}
                                </Text>
                            </VStack>
                        </HStack>
                        <Button
                            onPress={() => handleSelectProduct(item)}
                            action="secondary"
                            className="w-12 h-12 bg-transparent"
                        >
                            <ButtonIcon
                                as={SearchIcon}
                                className="w-10 h-10"
                            />
                        </Button>
                    </HStack>
                    <Divider
                        orientation="horizontal"
                        className="w-full h-0.5 bg-gray-100"
                    />
                    <VStack className="mt-4 w-full">
                        <HStack className="items-center justify-between mb-2">
                            <HStack space="sm" className="items-center flex-1">
                                <Icon as={SearchIcon} className="text-gray-600" />
                                <Text className="capitalize text-xl font-semibold">
                                    Nutrition
                                </Text>
                            </HStack>
                            {item.nutriments?.energy_100g !== undefined && (
                                <Box className="bg-red-300 rounded-md px-2 py-1 w-24 items-center">
                                    <Text className="text-white font-bold bg-red-500 rounded-t-md w-full text-center">Calories</Text>
                                    <Text className="text-center">{getEnergyValue(item.nutriments?.energy_100g)} kcal</Text>
                                </Box>
                            )}
                        </HStack>
                        <HStack className="justify-around pt-3 border-t border-gray-100">
                            <Box className="bg-amber-300 rounded-md px-2 py-1 w-24 items-center">
                                <Text className="text-white font-bold bg-amber-500 rounded-t-md w-full text-center">Glucides</Text>
                                <Text className="text-center">{formatNutrientValue(item.nutriments?.carbohydrates_100g)} g</Text>
                            </Box>
                            <Divider
                                orientation="vertical"
                                className="w-0.5 h-14 bg-gray-100 mx-3"
                            />
                            <Box className="bg-green-300 rounded-md px-2 py-1 w-24 items-center">
                                <Text className="text-white font-bold bg-green-500 rounded-t-md w-full text-center">Lipides</Text>
                                <Text className="text-center">{formatNutrientValue(item.nutriments?.fat_100g)} g</Text>
                            </Box>
                            <Divider
                                orientation="vertical"
                                className="w-0.5 h-14 bg-gray-300 mx-3"
                            />
                            <Box className="bg-blue-300 rounded-md px-2 py-1 w-24 items-center">
                                <Text className="text-white font-bold bg-blue-500 rounded-t-md w-full text-center">Protéines</Text>
                                <Text className="text-center">{formatNutrientValue(item.nutriments?.proteins_100g)} g</Text>
                            </Box>
                        </HStack>
                    </VStack>
                </Card>
            </Animated.View>
        );
    };

    // Rendu de la vue détaillée d'un produit
    const renderProductDetails = () => {
        if (!selectedProduct) return null;
        
        const product = selectedProduct;
        const imageSource = product.image_url 
            ? { uri: product.image_url } 
            : product.image_front_url 
                ? { uri: product.image_front_url }
                : require('@/assets/images/seed/kouskousi.jpg');
                
        // Fonctions utilitaires pour afficher les valeurs nutritionnelles en toute sécurité
        const formatNutrientValue = (value: number | null | undefined): string => {
            if (typeof value === 'number') {
                return Math.round(value).toString();
            }
            return '0';
        };
        
        return (
            <View className="flex-1">
                {/* Arrière-plan flou */}
                <View className="absolute w-full h-full">
                    <Image
                        source={imageSource}
                        className="w-full h-full absolute"
                        resizeMode="cover"
                        blurRadius={25}
                        alt={`${product.product_name} background`}
                    />
                    <View className="absolute w-full h-full" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />
                </View>
                
                <ScrollView className="flex-1">
                    <VStack space="lg" className="p-4 pt-12">
                        {/* Image et header du produit */}
                        <Card className="overflow-hidden bg-white/80 backdrop-blur-md">
                            <Image
                                source={imageSource}
                                className="w-full h-48"
                                resizeMode="cover"
                                alt={product.product_name}
                            />
                            <Box className="p-4">
                                <VStack space="xs">
                                    <Text className="text-2xl font-bold text-gray-900">
                                        {product.product_name}
                                    </Text>
                                    {product.brands && (
                                        <Text className="text-sm text-gray-500">
                                            {product.brands}
                                        </Text>
                                    )}
                                </VStack>
                            </Box>
                        </Card>
                        
                        {/* Informations nutritionnelles */}
                        <Card className="p-4 bg-white/80 backdrop-blur-md">
                            <Text className="text-lg font-semibold mb-4 text-gray-900">
                                Valeurs nutritionnelles
                            </Text>
                            <HStack className="justify-between">
                                <Box className="items-center bg-gray-200 rounded-lg p-3 flex-1">
                                    <Text className="text-2xl font-bold text-gray-800">
                                        {formatNutrientValue(product.nutriments?.energy_100g)}
                                    </Text>
                                    <Text className="text-sm text-gray-600">kcal</Text>
                                </Box>
                                <Box className="items-center bg-blue-100 rounded-lg p-3 flex-1 ml-2">
                                    <Text className="text-2xl font-bold text-blue-600">
                                        {formatNutrientValue(product.nutriments?.proteins_100g)}g
                                    </Text>
                                    <Text className="text-sm text-blue-600">Protéines</Text>
                                </Box>
                                <Box className="items-center bg-green-100 rounded-lg p-3 flex-1 ml-2">
                                    <Text className="text-2xl font-bold text-green-600">
                                        {formatNutrientValue(product.nutriments?.carbohydrates_100g)}g
                                    </Text>
                                    <Text className="text-sm text-green-600">Glucides</Text>
                                </Box>
                                <Box className="items-center bg-orange-100 rounded-lg p-3 flex-1 ml-2">
                                    <Text className="text-2xl font-bold text-orange-600">
                                        {formatNutrientValue(product.nutriments?.fat_100g)}g
                                    </Text>
                                    <Text className="text-sm text-orange-600">Lipides</Text>
                                </Box>
                            </HStack>
                        </Card>
                        
                        {/* Ajouter à un repas */}
                        <Card className="p-4 bg-white/80 backdrop-blur-md">
                            <Text className="text-lg font-semibold mb-4 text-gray-900">
                                Ajouter à un repas
                            </Text>
                            <Button onPress={() => handleAddToMeal(product)}>
                                <Text className="text-white font-semibold">Ajouter à un repas</Text>
                            </Button>
                        </Card>
                        
                        {/* Retour à la recherche */}
                        <Card className="p-4 bg-white/80 backdrop-blur-md mt-2">
                            <Button 
                                variant="outline"
                                onPress={() => setSelectedProduct(null)}
                            >
                                <Text className="font-semibold">Retour à la recherche</Text>
                            </Button>
                        </Card>
                        
                        {/* Information sur le produit */}
                        <Card className="p-4 bg-white/80 backdrop-blur-md">
                            <Text className="text-lg font-semibold mb-4 text-gray-900">
                                Information sur le produit
                            </Text>
                            <VStack space="sm">
                                {product.code && (
                                    <HStack className="justify-between">
                                        <Text className="text-gray-500">Code-barres</Text>
                                        <Text className="font-medium">{product.code}</Text>
                                    </HStack>
                                )}
                                {product.quantity && (
                                    <HStack className="justify-between">
                                        <Text className="text-gray-500">Quantité</Text>
                                        <Text className="font-medium">{product.quantity}</Text>
                                    </HStack>
                                )}
                                {product.serving_size && (
                                    <HStack className="justify-between">
                                        <Text className="text-gray-500">Portion</Text>
                                        <Text className="font-medium">{product.serving_size}</Text>
                                    </HStack>
                                )}
                                {product.categories && (
                                    <HStack className="justify-between">
                                        <Text className="text-gray-500">Catégories</Text>
                                        <Text className="font-medium text-right flex-1 ml-4">{product.categories}</Text>
                                    </HStack>
                                )}
                            </VStack>
                        </Card>
                    </VStack>
                </ScrollView>
            </View>
        );
    };

    // UI pour la recherche
    const renderSearchUI = () => {
        // Fonction pour gérer le clic sur le bouton de recherche
        const handleSearchButtonPress = () => {
            if (searchTerm.length >= 2) {
                performSearch(searchTerm, 1, false);
            }
        };

        return (
            <VStack className="flex-1 w-full p-4 gap-4">
                <HStack className="w-full justify-between">
                    <Button 
                        onPress={() => router.push('/scanner')}
                        className="bg-transparent w-12 h-12"
                        action="secondary"
                    >
                        <ButtonIcon as={CircleChevronLeft} className="w-10 h-10 text-black" />
                    </Button>
                    <Heading size="xl" className="text-center font-semibold">
                        Recherche de Produits
                    </Heading>
                    <Box className="w-12"></Box>
                </HStack>

                <VStack className="gap-3">
                    <Input
                        variant="outline"
                        className="bg-white/90 rounded-xl h-12 p-1"
                    >
                        <InputIcon as={SearchIcon} className="text-gray-400" />
                        <InputField
                            placeholder="Rechercher un produit..."
                            value={searchTerm}
                            onChangeText={handleSearchTermChange}
                        />
                    </Input>

                    {/* Suggestions */}
                    {showSuggestions && suggestions.length > 0 && (
                        <Card className="absolute top-14 w-full z-10 bg-white/95 rounded-xl shadow-md">
                            <VStack className="p-2">
                                {suggestions.map((suggestion, index) => (
                                    <Animated.View 
                                        key={index} 
                                        entering={FadeInUp.delay(index * 50)}
                                    >
                                        <Pressable
                                            className="p-3 border-b border-gray-100"
                                            onPress={() => handleSelectSuggestion(suggestion)}
                                        >
                                            <Text>{suggestion}</Text>
                                        </Pressable>
                                    </Animated.View>
                                ))}
                            </VStack>
                        </Card>
                    )}

                    {/* Filtres */}
                    <HStack className="gap-2">
                        <Select 
                            onValueChange={setSelectedCategory}
                            className="flex-1"
                        >
                            <SelectTrigger className="h-12 bg-white/90 rounded-xl">
                                <SelectInput
                                    placeholder="Catégorie"
                                    value={selectedCategory}
                                />
                                <Box className="mr-2">
                                    <Icon as={FilterIcon} className="w-5 h-5 text-gray-500" />
                                </Box>
                            </SelectTrigger>
                            <SelectPortal>
                                <SelectBackdrop />
                                <SelectContent>
                                    <SelectDragIndicatorWrapper>
                                        <SelectDragIndicator />
                                    </SelectDragIndicatorWrapper>
                                    <SelectItem value="" label="Toutes les catégories" />
                                    {categories.map((category) => (
                                        <SelectItem 
                                            key={category} 
                                            value={category} 
                                            label={category} 
                                        />
                                    ))}
                                </SelectContent>
                            </SelectPortal>
                        </Select>

                        <Select 
                            onValueChange={setSelectedBrand}
                            className="flex-1"
                        >
                            <SelectTrigger className="h-12 bg-white/90 rounded-xl">
                                <SelectInput
                                    placeholder="Marque"
                                    value={selectedBrand}
                                />
                                <Box className="mr-2">
                                    <Icon as={FilterIcon} className="w-5 h-5 text-gray-500" />
                                </Box>
                            </SelectTrigger>
                            <SelectPortal>
                                <SelectBackdrop />
                                <SelectContent>
                                    <SelectDragIndicatorWrapper>
                                        <SelectDragIndicator />
                                    </SelectDragIndicatorWrapper>
                                    <SelectItem value="" label="Toutes les marques" />
                                    {brands.map((brand) => (
                                        <SelectItem 
                                            key={brand} 
                                            value={brand} 
                                            label={brand} 
                                        />
                                    ))}
                                </SelectContent>
                            </SelectPortal>
                        </Select>
                    </HStack>

                    <HStack className="justify-between">
                        <Button
                            onPress={handleSearchButtonPress}
                            className="flex-1 mr-2 h-12"
                            isDisabled={searchTerm.length < 2}
                        >
                            <ButtonText>Rechercher</ButtonText>
                        </Button>
                        <Button
                            onPress={resetFilters}
                            className="bg-gray-200 h-12"
                            action="secondary"
                        >
                            <ButtonText className="text-gray-700">Réinitialiser</ButtonText>
                        </Button>
                    </HStack>
                </VStack>

                {/* Résultats de la recherche */}
                {loading && !refreshing ? (
                    <Box className="flex-1 justify-center items-center">
                        <Spinner size="large" />
                        <Text className="mt-4">Recherche en cours...</Text>
                    </Box>
                ) : searchResults.length > 0 ? (
                    <FlashList
                        data={searchResults}
                        renderItem={renderProductItem}
                        keyExtractor={(item) => item.code || item._id || Math.random().toString()}
                        estimatedItemSize={200}
                        contentContainerStyle={{ padding: 16 }}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                    />
                ) : searchTerm.length >= 2 ? (
                    <Box className="flex-1 justify-center items-center">
                        <Text className="text-lg text-gray-500">Aucun résultat trouvé</Text>
                    </Box>
                ) : (
                    <Box className="flex-1 justify-center items-center">
                        <Text className="text-lg text-gray-500">
                            Veuillez saisir au moins 2 caractères pour effectuer une recherche
                        </Text>
                    </Box>
                )}
                
                {/* Pagination */}
                {searchResults.length > 0 && (
                    <HStack className="p-4 justify-center space-x-2">
                        <Button
                            onPress={() => handlePageChange(currentPage - 1)}
                            isDisabled={currentPage === 1}
                            className={currentPage === 1 ? "bg-gray-300" : ""}
                        >
                            <ButtonText>Précédent</ButtonText>
                        </Button>
                        <Text className="self-center">
                            Page {currentPage} sur {totalPages}
                        </Text>
                        <Button
                            onPress={() => handlePageChange(currentPage + 1)}
                            isDisabled={currentPage === totalPages}
                            className={currentPage === totalPages ? "bg-gray-300" : ""}
                        >
                            <ButtonText>Suivant</ButtonText>
                        </Button>
                    </HStack>
                )}
            </VStack>
        );
    };

    return (
        <View className="flex-1">
            {renderSearchUI()}
            {selectedProduct && renderProductDetails()}
        </View>
    );
}
