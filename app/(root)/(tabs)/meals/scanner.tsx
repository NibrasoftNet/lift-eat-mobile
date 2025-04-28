import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Button, Platform, Image, ScrollView, StatusBar as RNStatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { BlurView } from 'expo-blur';
import { Card } from '@/components/ui/card';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import scannerService from '@/utils/services/scanner.service';

export default function ScannerTab() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<any | null>(null);
  
  useEffect(() => {
    const checkPermission = async () => {
      console.log('Checking camera permission status...');
      if (!permission?.granted) {
        console.log('Permission not granted, requesting...');
        const perm = await requestPermission();
        console.log('Permission request result:', perm.granted);
      } else {
        console.log('Camera permission already granted');
      }
    };
    
    checkPermission();
  }, [permission, requestPermission]);
  
  const handleBarCodeScanned = async (scanResult: BarcodeScanningResult) => {
    const { type, data } = scanResult;
    setScanned(true);
    setScannedData(data);
    console.log(`Bar code with type ${type} and data ${data} has been scanned!`);
    
    // Récupérer les informations du produit via le service
    setLoading(true);
    try {
      // Utiliser le service scanner au lieu d'appeler directement OpenFoodFactsService
      const result = await scannerService.scanBarcode(data);
      setScanResult(result);
      console.log('Scan result:', result);
    } catch (error) {
      console.error('Error checking product:', error);
      setScanResult({
        isValid: false,
        message: "Une erreur s'est produite lors de la vérification du produit",
        productResult: null,
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Display permission status information for debugging
  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Vérification des permissions de caméra...</Text>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }
  
  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>L'accès à la caméra est nécessaire pour scanner les codes-barres</Text>
        <Button 
          title="Autoriser l'accès à la caméra" 
          onPress={requestPermission} 
        />
        <Text style={styles.debugText}>
          {`Permission state: ${JSON.stringify(permission, null, 2)}`}
        </Text>
      </SafeAreaView>
    );
  }
  
  // Fonction pour afficher les détails du produit
  const renderProductDetails = () => {
    if (!scanResult?.productResult) return null;
    
    const product = scanResult.productResult;
    const imageSource = product.image || require('@/assets/images/image-non-disponible.jpg');
    
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.productContainer}>
          {/* Arrière-plan flouté */}
          <View style={styles.backgroundContainer}>
            <Image
              source={imageSource}
              style={styles.backgroundImage}
              resizeMode="cover"
              blurRadius={25}
            />
            <BlurView intensity={100} style={StyleSheet.absoluteFill} />
          </View>
          
          <ScrollView style={styles.scrollView}>
            <VStack space="lg" style={styles.contentContainer}>
              {/* Image et titre du produit */}
              <Card style={styles.card}>
                <Image
                  source={imageSource}
                  style={styles.productImage}
                  resizeMode="cover"
                />
                <Box style={styles.cardContent}>
                  <Text style={styles.productTitle}>{product.name}</Text>
                  {product.brands && (
                    <Text style={styles.brandText}>{product.brands}</Text>
                  )}
                </Box>
              </Card>
              
              {/* Informations nutritionnelles */}
              <Card style={styles.card}>
                <Text style={styles.sectionTitle}>Valeurs nutritionnelles</Text>
                <HStack style={styles.nutritionRow}>
                  <Box style={[styles.nutritionItem, styles.caloriesItem]}>
                    <Text style={styles.nutritionValue}>{product.calories}</Text>
                    <Text style={styles.nutritionLabel}>Calories</Text>
                  </Box>
                  <Box style={[styles.nutritionItem, styles.proteinsItem]}>
                    <Text style={styles.nutritionValue}>{product.protein}g</Text>
                    <Text style={styles.nutritionLabel}>Protéines</Text>
                  </Box>
                  <Box style={[styles.nutritionItem, styles.carbsItem]}>
                    <Text style={styles.nutritionValue}>{product.carbs}g</Text>
                    <Text style={styles.nutritionLabel}>Glucides</Text>
                  </Box>
                  <Box style={[styles.nutritionItem, styles.fatsItem]}>
                    <Text style={styles.nutritionValue}>{product.fats}g</Text>
                    <Text style={styles.nutritionLabel}>Lipides</Text>
                  </Box>
                </HStack>
              </Card>
              
              {/* Informations supplémentaires */}
              {product.categories && (
                <Card style={styles.card}>
                  <Text style={styles.sectionTitle}>Informations additionnelles</Text>
                  <VStack space="xs">
                    {product.categories && (
                      <Text style={styles.infoText}>
                        <Text style={styles.infoLabel}>Catégories: </Text>
                        {product.categories}
                      </Text>
                    )}
                    {product.nutriscore_grade && (
                      <Text style={styles.infoText}>
                        <Text style={styles.infoLabel}>Nutriscore: </Text>
                        {product.nutriscore_grade.toUpperCase()}
                      </Text>
                    )}
                  </VStack>
                </Card>
              )}
              
              {/* Bouton pour scanner à nouveau */}
              <View style={styles.buttonContainer}>
                <Button 
                  title="Scanner un autre produit" 
                  onPress={() => {
                    setScanned(false);
                    setScanResult(null);
                  }} 
                />
              </View>
            </VStack>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  };
  
  // Affichage de l'écran de scan
  const renderScanner = () => {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        {Platform.OS === 'android' && <View style={styles.statusBarPlaceholder} />}
        
        <View style={styles.cameraContainer}>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ['ean13', 'ean8'],
            }}
          >
            <View style={styles.overlay}>
              {loading ? (
                <View style={styles.loadingBox}>
                  <ActivityIndicator size="large" color="#fff" />
                  <Text style={styles.loadingText}>Recherche du produit...</Text>
                </View>
              ) : (
                <>
                  <View style={styles.scanFrame} />
                  <View style={styles.instructionBox}>
                    <Text style={styles.instructionText}>
                      Placez un code-barres dans le cadre pour le scanner
                    </Text>
                  </View>
                </>
              )}
            </View>
          </CameraView>
        </View>
      </SafeAreaView>
    );
  };
  
  // Fonction pour afficher un message d'erreur et permettre de scanner à nouveau
  const renderErrorState = () => {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <VStack space="lg" style={styles.errorContainer}>
          <Text style={styles.errorTitle}>
            {scanResult ? scanResult.message : "Produit non trouvé"}
          </Text>
          <Text style={styles.errorDescription}>
            Le produit n'a pas pu être identifié. Veuillez essayer de scanner à nouveau ou rechercher manuellement.
          </Text>
          <Button
            title="Scanner un autre produit"
            onPress={() => {
              setScanned(false);
              setScanResult(null);
            }}
            color="#FF6B00"
          />
        </VStack>
      </SafeAreaView>
    );
  };

  // Si on a scanné mais le résultat n'est pas valide ou pas de produit trouvé
  if (scanned && scanResult && (!scanResult.isValid || !scanResult.productResult)) {
    return renderErrorState();
  }
  
  // Si on a un résultat valide avec un produit, afficher les détails
  if (scanResult && scanResult.isValid && scanResult.productResult) {
    return renderProductDetails();
  }
  
  // Par défaut, afficher le scanner
  return renderScanner();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B00',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  debugText: {
    margin: 20,
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  statusBarPlaceholder: {
    height: RNStatusBar.currentHeight || 0,
    backgroundColor: 'transparent',
  },
  cameraContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  scanFrame: {
    width: 280,
    height: 280,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 20,
    backgroundColor: 'transparent',
    marginBottom: 50,
  },
  instructionBox: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    padding: 20,
  },
  instructionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  loadingBox: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  productContainer: {
    flex: 1,
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  productImage: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: 16,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  brandText: {
    fontSize: 16,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 16,
    marginBottom: 12,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  nutritionItem: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    width: '22%',
  },
  caloriesItem: {
    backgroundColor: '#FFE0E0',
  },
  proteinsItem: {
    backgroundColor: '#E0F0FF',
  },
  carbsItem: {
    backgroundColor: '#E0FFE0',
  },
  fatsItem: {
    backgroundColor: '#FFE0F0',
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoText: {
    fontSize: 16,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  infoLabel: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});
