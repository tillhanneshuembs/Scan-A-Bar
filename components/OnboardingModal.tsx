import {
  Modal, View, Text, TouchableOpacity, StyleSheet, Linking, Image,
} from "react-native";
import { Colors, Fonts } from "../lib/theme";

export function OnboardingModal({ visible, onDone }: { visible: boolean; onDone: () => void }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Image source={require("../assets/logo.png")} style={styles.logo} resizeMode="contain" />

          <Text style={styles.title}>Willkommen bei Scan-A-Bar</Text>
          <Text style={styles.body}>
            Scanne Proteinriegel und vergleiche sie nach Nährwerten, Geschmack und Preis — objektiv und übersichtlich.
          </Text>

          <View style={styles.points}>
            <Text style={styles.point}>📷  Barcode scannen & Riegel sofort einordnen</Text>
            <Text style={styles.point}>🏆  Ranglisten nach Nährwert, Geschmack & Preis</Text>
            <Text style={styles.point}>📬  Fehlenden Riegel einreichen</Text>
          </View>

          <Text style={styles.privacy}>
            Mit der Nutzung der App stimmst du unserer{" "}
            <Text
              style={styles.privacyLink}
              onPress={() => Linking.openURL("https://scan-a-bar-backend.vercel.app/datenschutz")}
            >
              Datenschutzerklärung
            </Text>
            {" "}zu.
          </Text>

          <TouchableOpacity style={styles.button} onPress={onDone} activeOpacity={0.85}>
            <Text style={styles.buttonText}>Loslegen</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center", alignItems: "center", padding: 24,
  },
  card: {
    backgroundColor: "#fff", borderRadius: 24, padding: 28,
    alignItems: "center", width: "100%",
  },
  logo: { width: 72, height: 72, marginBottom: 16 },
  title: {
    fontSize: 20, fontFamily: Fonts.black, color: Colors.text,
    textAlign: "center", marginBottom: 12,
  },
  body: {
    fontSize: 14, fontFamily: Fonts.regular, color: Colors.textSecondary,
    textAlign: "center", lineHeight: 21, marginBottom: 20,
  },
  points: { alignSelf: "stretch", gap: 8, marginBottom: 24 },
  point: {
    fontSize: 13, fontFamily: Fonts.medium, color: Colors.text, lineHeight: 20,
  },
  privacy: {
    fontSize: 11, fontFamily: Fonts.regular, color: Colors.textMuted,
    textAlign: "center", lineHeight: 16, marginBottom: 20,
  },
  privacyLink: { textDecorationLine: "underline" },
  button: {
    backgroundColor: Colors.primary, borderRadius: 14,
    paddingVertical: 15, alignItems: "center", alignSelf: "stretch",
  },
  buttonText: { color: Colors.text, fontSize: 15, fontFamily: Fonts.bold },
});
