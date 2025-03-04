import { useState, useEffect } from 'react';
import { CameraView, useCameraPermissions, type CameraType, type BarcodeScanningResult } from 'expo-camera';
import { Button, StyleSheet, Text } from 'react-native';
import { Heading } from '@/components/ui/heading';
import { VStack } from '@/components/ui/vstack';

export default function Scanner() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState<string | null>(null);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  // Correction du typage de l'événement de scan
  const handleBarCodeScanned = (scanningResult: BarcodeScanningResult) => {
    setScannedData(scanningResult.data);
  };

  if (!permission) {
    return <Text>Chargement des permissions...</Text>;
  }

  if (!permission.granted) {
    return (
      <VStack>
        <Heading className="text-typography-900">
          Permission caméra non accordée
        </Heading>
        <Button title="Autoriser la caméra" onPress={requestPermission} />
      </VStack>
    );
  }

  return (
    <VStack style={styles.container}>
      {scannedData ? (
        <>
          <Heading className="text-typography-900">
            Code-barres scanné : {scannedData}
          </Heading>
          <Button title="Scanner à nouveau" onPress={() => setScannedData(null)} />
        </>
      ) : (
        <CameraView
          style={styles.camera}
          facing={facing}
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: [
              'qr', 
              'pdf417', 
              'upc_e', 
              'upc_a', 
              'ean13', 
              'code128'
            ],
          }}
        />
      )}
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