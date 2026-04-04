import { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { findProductByEan } from "../lib/findProduct";
import * as Haptics from "expo-haptics";

type Props = NativeStackScreenProps<RootStackParamList, "Scanner">;

export default function ScannerScreen({ navigation }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const scannedRef = useRef(false);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>
          Kamera-Zugriff wird benötigt um Barcodes zu scannen.
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Zugriff erlauben</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarcode = ({ data }: { data: string }) => {
    if (scannedRef.current || loading) return;
    scannedRef.current = true;
    setLoading(true);

    const product = findProductByEan(data);

    if (!product) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        "Nicht in der Datenbank",
        "Dieser Riegel ist nicht in unserer Rangliste der 107 Proteinriegel.",
        [{ text: "Nochmal scannen", onPress: () => { scannedRef.current = false; setLoading(false); } }]
      );
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    navigation.replace("Result", { product });
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={loading ? undefined : handleBarcode}
        barcodeScannerSettings={{ barcodeTypes: ["ean13", "ean8", "upc_a"] }}
      />

      <View style={styles.overlay}>
        <View style={styles.topOverlay} />
        <View style={styles.middleRow}>
          <View style={styles.sideOverlay} />
          <View style={styles.scanWindow}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          <View style={styles.sideOverlay} />
        </View>
        <View style={styles.bottomOverlay}>
          {loading ? (
            <ActivityIndicator size="large" color="#2E86DE" />
          ) : (
            <Text style={styles.hint}>Barcode in den Rahmen halten</Text>
          )}
        </View>
      </View>
    </View>
  );
}

const WINDOW_SIZE = 260;
const CORNER_SIZE = 24;
const CORNER_THICKNESS = 4;
const CORNER_COLOR = "#2E86DE";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", alignItems: "center", justifyContent: "center" },
  permissionText: { color: "#fff", fontSize: 16, textAlign: "center", marginBottom: 24, paddingHorizontal: 32 },
  button: { backgroundColor: "#2E86DE", paddingVertical: 14, paddingHorizontal: 32, borderRadius: 12 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  overlay: { ...StyleSheet.absoluteFillObject },
  topOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)" },
  middleRow: { flexDirection: "row", height: WINDOW_SIZE },
  sideOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)" },
  scanWindow: { width: WINDOW_SIZE, height: WINDOW_SIZE },
  bottomOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", alignItems: "center", paddingTop: 24 },
  hint: { color: "#90B8D4", fontSize: 14 },
  corner: { position: "absolute", width: CORNER_SIZE, height: CORNER_SIZE },
  topLeft: { top: 0, left: 0, borderTopWidth: CORNER_THICKNESS, borderLeftWidth: CORNER_THICKNESS, borderColor: CORNER_COLOR },
  topRight: { top: 0, right: 0, borderTopWidth: CORNER_THICKNESS, borderRightWidth: CORNER_THICKNESS, borderColor: CORNER_COLOR },
  bottomLeft: { bottom: 0, left: 0, borderBottomWidth: CORNER_THICKNESS, borderLeftWidth: CORNER_THICKNESS, borderColor: CORNER_COLOR },
  bottomRight: { bottom: 0, right: 0, borderBottomWidth: CORNER_THICKNESS, borderRightWidth: CORNER_THICKNESS, borderColor: CORNER_COLOR },
});
