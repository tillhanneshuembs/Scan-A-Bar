import { useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  Image, SafeAreaView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { Colors, Fonts } from "../lib/theme";
import { FeedbackModal } from "../components/FeedbackModal";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const [feedbackVisible, setFeedbackVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <FeedbackModal visible={feedbackVisible} onClose={() => setFeedbackVisible(false)} />
      <View style={styles.container}>

        {/* Top: Logo + Headline */}
        <View style={styles.heroArea}>
          <Image
            source={require("../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.headline}>
            Welcher Proteinriegel{"\n"}ist wirklich der Beste?
          </Text>
          <Text style={styles.subline}>
            Scanne einen Riegel oder vergleiche im Ranking!
          </Text>
        </View>

        {/* Bottom: Buttons */}
        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate("Scanner")}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>Barcode Scannen</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("Ranking", { rankType: "naehrwert", highlightEan: "" })}
            activeOpacity={0.85}
          >
            <Text style={styles.secondaryButtonText}>Riegel vergleichen</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setFeedbackVisible(true)} activeOpacity={0.7} style={styles.feedbackLinkWrap}>
            <Text style={styles.feedbackLink}>Feedback geben</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 16,
    paddingBottom: 36,
    justifyContent: "space-between",
  },
  heroArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 8,
  },
  headline: {
    fontSize: 26,
    fontFamily: Fonts.black,
    color: Colors.text,
    textAlign: "center",
    lineHeight: 34,
  },
  subline: {
    fontSize: 13,
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  buttons: {
    gap: 10,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
  },
  primaryButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontFamily: Fonts.bold,
    letterSpacing: 0.3,
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.text,
  },
  secondaryButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontFamily: Fonts.bold,
    letterSpacing: 0.3,
  },
  feedbackLinkWrap: { alignItems: "center", paddingTop: 4 },
  feedbackLink: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: Colors.textMuted,
    textDecorationLine: "underline",
  },
});
