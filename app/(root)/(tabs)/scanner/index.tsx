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
import OpenFoodFactsService, {
  ScanResult,
} from '@/utils/api/OpenFoodFactsService';

export default function Scanner() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showErrorSheet, setShowErrorSheet] = useState<boolean>(false);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  // Handle barcode scan result
  const handleBarCodeScanned = async (
    scanningResult: BarcodeScanningResult,
  ) => {
    const barcode = scanningResult.data;
    if (scannedData === barcode) return; // Prevent duplicate scans

    setScannedData(barcode);
    setLoading(true);

    try {
      const result = await OpenFoodFactsService.scanBarcode(barcode);
      setScanResult(result);

      // Show error sheet if product is not found
      if (!result.isValid) {
        setShowErrorSheet(true);
      }
    } catch (error) {
      console.error('Error checking product:', error);
      setScanResult({
        isValid: false,
        message: "Une erreur s'est produite lors de la vérification du produit",
        productResult: null,
      });
      setShowErrorSheet(true);
    } finally {
      setLoading(false);
    }
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
    if (!scanResult?.productResult) return null;

    const product = scanResult.productResult;
    // Ensure we always have a valid image source
    const imageSource: ImageSourcePropType =
      product.image || require('@/assets/images/image-non-disponible.jpg');

    return (
      <View className="flex-1">
        {/* Blurred background */}
        <View className="absolute w-full h-full">
          <Image
            source={imageSource}
            className="w-full h-full absolute"
            resizeMode="cover"
            blurRadius={25}
            alt={`${product.name} background`}
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
                alt={product.name}
              />
              <Box className="p-4">
                <VStack space="xs">
                  <Text className="text-2xl font-bold text-gray-900">
                    {product.name}
                  </Text>
                  {product.brands && (
                    <Text className="text-sm text-gray-500">
                      {product.brands}
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
                    {product.calories}
                  </Text>
                  <Text className="text-sm text-gray-600">Calories</Text>
                </Box>
                <Box className="items-center bg-blue-100 rounded-lg p-3 flex-1 ml-2">
                  <Text className="text-2xl font-bold text-blue-600">
                    {product.protein}g
                  </Text>
                  <Text className="text-sm text-blue-600">Protéines</Text>
                </Box>
                <Box className="items-center bg-green-100 rounded-lg p-3 flex-1 ml-2">
                  <Text className="text-2xl font-bold text-green-600">
                    {product.carbs}g
                  </Text>
                  <Text className="text-sm text-green-600">Carbs</Text>
                </Box>
                <Box className="items-center bg-orange-100 rounded-lg p-3 flex-1 ml-2">
                  <Text className="text-2xl font-bold text-orange-600">
                    {product.fats}g
                  </Text>
                  <Text className="text-sm text-orange-600">Fats</Text>
                </Box>
              </HStack>
            </Card>

            {/* Additional product info */}
            {product.categories && (
              <Card className="p-4 bg-white/80 backdrop-blur-md">
                <Text className="text-lg font-semibold mb-2 text-gray-900">
                  Informations additionnelles
                </Text>
                <VStack space="xs">
                  {product.categories && (
                    <Text className="text-sm text-gray-700">
                      <Text className="font-bold">Categories:</Text>{' '}
                      {product.categories}
                    </Text>
                  )}
                  {product.nutriscore_grade && (
                    <Text className="text-sm text-gray-700">
                      <Text className="font-bold">Nutriscore:</Text>{' '}
                      {product.nutriscore_grade.toUpperCase()}
                    </Text>
                  )}
                </VStack>
              </Card>
            )}

            {/* Scan again button */}
            <Button
              title="Scanner un autre produit"
              onPress={resetScanner}
              color="#3498db"
            />
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
      {/*      <Actionsheet
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
                "Le produit n'a pas été trouvé ."}
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
      </Actionsheet>*/}
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
