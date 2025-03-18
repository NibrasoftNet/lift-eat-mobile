import React, { useState, useEffect, Fragment } from 'react';
import {
  CameraView,
  useCameraPermissions,
  type CameraType,
  type BarcodeScanningResult,
} from 'expo-camera';
import {
  Button,
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  ImageSourcePropType,
} from 'react-native';
import { Heading } from '@/components/ui/heading';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Box } from '@/components/ui/box';
import { BlurView } from 'expo-blur';
import { Card } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import {
  Actionsheet,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetBackdrop,
  ActionsheetItem,
  ActionsheetItemText,
} from '@/components/ui/actionsheet';
import OpenFoodFactsService, {
  ScanResult,
} from '@/utils/api/OpenFoodFactsService';
import { useRouter } from 'expo-router';
import { useDrizzleDb } from '@/utils/providers/DrizzleProvider';
import { saveScannedProductAsIngredient } from '@/utils/services/ingredient.service';

export default function Scanner() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showErrorSheet, setShowErrorSheet] = useState(false);
  const router = useRouter();
  const db = useDrizzleDb();

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  useEffect(() => {
    // When scanned data changes, fetch product info if we have a barcode
    const fetchProductData = async () => {
      if (scannedData) {
        setLoading(true);
        try {
          // Scan barcode and get product info
          const result = await OpenFoodFactsService.scanBarcode(scannedData);
          setScanResult(result);
          
          // Si le scan est valide et que le produit existe
          if (result.isValid && result.product) {
            // Enregistrer le produit dans la table ingredients_standard
            await saveScannedProductAsIngredient(db, result.product);
          } else {
            // Show error sheet if product is not found
            setShowErrorSheet(true);
          }
        } catch (error) {
          console.error('Error fetching product data:', error);
          // Handle error - show user a message that scan failed
          setScanResult({
            isValid: false,
            message: 'Erreur lors de la recherche du produit. Veuillez réessayer.',
            product: null,
            ingredient: null,
          });
          setShowErrorSheet(true);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProductData();
  }, [scannedData, db]);

  // Handle barcode scan result
  const handleBarCodeScanned = async (
    scanningResult: BarcodeScanningResult,
  ) => {
    const barcode = scanningResult.data;
    if (scannedData === barcode) return; // Prevent duplicate scans

    setScannedData(barcode);
  };

  const resetScanner = () => {
    setScannedData(null);
    setScanResult(null);
    setShowErrorSheet(false);
  };

  if (!permission) {
    return <Text>Chargement des permissions...</Text>;
  }

  if (!permission.granted) {
    return (
      <VStack className="p-4 flex-1 justify-center items-center">
        <Heading className="text-typography-900 mb-4">
          Permission caméra non accordée
        </Heading>
        <Button title="Autoriser la caméra" onPress={requestPermission} />
      </VStack>
    );
  }

  // Render product details when found
  const renderProductDetails = () => {
    if (!scanResult?.ingredient) return null;

    const ingredient = scanResult.ingredient;
    // Ensure we always have a valid image source
    const imageSource: ImageSourcePropType =
      scanResult.product?.image_url 
        ? { uri: scanResult.product.image_url }
        : (scanResult.product?.image_front_url
          ? { uri: scanResult.product.image_front_url }
          : require('@/assets/images/seed/kouskousi.jpg'));

    return (
      <View className="flex-1">
        {/* Blurred background */}
        <View className="absolute w-full h-full">
          <Image
            source={imageSource}
            className="w-full h-full absolute"
            resizeMode="cover"
            blurRadius={25}
            alt={`${ingredient.name} background`}
          />
          <BlurView intensity={100} className="absolute w-full h-full" />
        </View>

        <ScrollView className="flex-1">
          <VStack space="lg" className="p-4 pt-12">
            {/* Product image and header */}
            <Card className="overflow-hidden bg-white/80 backdrop-blur-md">
              <Image
                source={imageSource}
                className="w-full h-48"
                resizeMode="cover"
                alt={ingredient.name}
              />
              <Box className="p-4">
                <VStack space="xs">
                  <Text className="text-2xl font-bold text-gray-900">
                    {ingredient.name}
                  </Text>
                  {scanResult.product?.brands && (
                    <Text className="text-sm text-gray-500">
                      {scanResult.product.brands}
                    </Text>
                  )}
                </VStack>
              </Box>
            </Card>

            {/* Nutrition information */}
            <Card className="p-4 bg-white/80 backdrop-blur-md">
              <Text className="text-lg font-semibold mb-4 text-gray-900">
                Valeurs nutritionnelles
              </Text>
              <HStack className="justify-between">
                <Box className="items-center bg-gray-200 rounded-lg p-3 flex-1">
                  <Text className="text-2xl font-bold text-gray-800">
                    {ingredient.calories}
                  </Text>
                  <Text className="text-sm text-gray-600">Calories</Text>
                </Box>
                <Box className="items-center bg-blue-100 rounded-lg p-3 flex-1 ml-2">
                  <Text className="text-2xl font-bold text-blue-600">
                    {ingredient.protein}g
                  </Text>
                  <Text className="text-sm text-blue-600">Protéines</Text>
                </Box>
                <Box className="items-center bg-green-100 rounded-lg p-3 flex-1 ml-2">
                  <Text className="text-2xl font-bold text-green-600">
                    {ingredient.carbs}g
                  </Text>
                  <Text className="text-sm text-green-600">Carbs</Text>
                </Box>
                <Box className="items-center bg-orange-100 rounded-lg p-3 flex-1 ml-2">
                  <Text className="text-2xl font-bold text-orange-600">
                    {ingredient.fat}g
                  </Text>
                  <Text className="text-sm text-orange-600">Fats</Text>
                </Box>
              </HStack>
            </Card>

            {/* Ajouter à un repas */}
            <Card className="p-4 bg-white/80 backdrop-blur-md">
              <Text className="text-lg font-semibold mb-4 text-gray-900">
                Ajouter à un repas
              </Text>
              <Button
                title="Ajouter à un repas"
                onPress={() => {
                  // S'assurer que nous avons un produit scanné
                  if (scanResult?.product) {
                    // Naviguer vers l'écran de création de repas avec l'ID de l'ingrédient standard
                    router.push({
                      pathname: "/meals/my-meals/create",
                      params: {
                        // Passer l'ID de l'ingrédient standard au lieu de tout l'objet ingrédient
                        ingredientStandardId: scanResult.product.code || String(Math.floor(Math.random() * 100000))
                      }
                    });
                  }
                }}
              />
            </Card>

            {/* Scanner à nouveau */}
            <Card className="p-4 bg-white/80 backdrop-blur-md mt-2">
              <Button
                title="Scanner un autre produit"
                onPress={resetScanner}
                color="#3498db"
              />
            </Card>

            {/* Information sur le produit */}
            <Card className="p-4 bg-white/80 backdrop-blur-md">
              <Text className="text-lg font-semibold mb-4 text-gray-900">
                Information sur le produit
              </Text>
              <VStack space="sm">
                {scanResult.product?.code && (
                  <HStack className="justify-between">
                    <Text className="text-gray-500">Code-barres</Text>
                    <Text className="font-medium">{scanResult.product.code}</Text>
                  </HStack>
                )}
                {scanResult.product?.quantity && (
                  <HStack className="justify-between">
                    <Text className="text-gray-500">Quantité</Text>
                    <Text className="font-medium">{scanResult.product.quantity}</Text>
                  </HStack>
                )}
                {scanResult.product?.serving_size && (
                  <HStack className="justify-between">
                    <Text className="text-gray-500">Portion</Text>
                    <Text className="font-medium">{scanResult.product.serving_size}</Text>
                  </HStack>
                )}
                {scanResult.product?.categories && (
                  <HStack className="justify-between">
                    <Text className="text-gray-500">Catégories</Text>
                    <Text className="font-medium text-right flex-1 ml-4">{scanResult.product.categories}</Text>
                  </HStack>
                )}
              </VStack>
            </Card>
          </VStack>
        </ScrollView>
      </View>
    );
  };

  return (
    <VStack style={styles.container}>
      {scannedData && scanResult?.isValid ? (
        // Show product details if found
        renderProductDetails()
      ) : (
        // Show camera or loading state
        <>
          {loading ? (
            <VStack className="flex-1 justify-center items-center">
              <Heading className="text-typography-900 mb-4">
                Analyse du code-barres en cours...
              </Heading>
              <Text>Code-barres scanné : {scannedData}</Text>
            </VStack>
          ) : (
            <>
              <CameraView
                style={styles.camera}
                facing={facing}
                onBarcodeScanned={
                  scannedData ? undefined : handleBarCodeScanned
                }
                barcodeScannerSettings={{
                  barcodeTypes: [
                    'qr',
                    'pdf417',
                    'upc_e',
                    'upc_a',
                    'ean13',
                    'code128',
                  ],
                }}
              >
                <VStack className="flex-1 justify-center items-center">
                  <Box className="w-64 h-64 border-2 border-white rounded-lg opacity-70" />
                  <Text className="text-white text-lg mt-4 font-bold">
                    Scannez un code-barres
                  </Text>
                </VStack>
              </CameraView>
              {scannedData && (
                <Button
                  title="Scanner à nouveau"
                  onPress={resetScanner}
                  color="#3498db"
                />
              )}
            </>
          )}
        </>
      )}

      {/* Error Action Sheet - visible when product is not found */}
      <Actionsheet
        isOpen={showErrorSheet}
        onClose={() => setShowErrorSheet(false)}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent className="bg-red-50">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator className="bg-red-300" />
          </ActionsheetDragIndicatorWrapper>
          <VStack space="md" className="w-full p-4 items-center">
            <Text className="text-xl font-bold text-red-700">
              Produit non trouvé
            </Text>
            <Text className="text-base text-red-600 text-center">
              {scanResult?.message ||
                "Le produit n'a pas été trouvé dans la base de données Open Food Facts."}
            </Text>
            <ActionsheetItem
              className="bg-red-500 rounded-lg mt-2"
              onPress={resetScanner}
            >
              <ActionsheetItemText className="text-white font-semibold">
                Scanner un autre produit
              </ActionsheetItemText>
            </ActionsheetItem>
          </VStack>
        </ActionsheetContent>
      </Actionsheet>
    </VStack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
});
