import { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, RankType } from "../App";
import { TOTAL_PRODUCTS } from "../lib/findProduct";
import { getProductImageUrl } from "../lib/images";
import { CircleScore } from "../components/CircleScore";
import { Colors, Fonts } from "../lib/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Result">;
type NutritionView = "riegel" | "100g";

function rankColor(rank: number) {
  if (rank === 1) return Colors.gold;
  if (rank === 2) return Colors.silver;
  if (rank === 3) return Colors.bronze;
  if (rank <= 10) return Colors.primary;
  return Colors.textSecondary;
}

function NutritionRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.nutritionRow}>
      <Text style={styles.nutritionLabel}>{label}</Text>
      <Text style={styles.nutritionValue}>{value}</Text>
    </View>
  );
}

function RankingPill({ label, rank, onPress }: { label: string; rank: number; onPress: () => void }) {
  const color = rankColor(rank);
  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity style={[styles.rankPill, { borderColor: color }]} onPress={onPress} activeOpacity={0.7}>
        <Text style={styles.rankPillLabel}>{label}</Text>
        <View style={styles.rankBadge}>
          <Text style={styles.rankBadgeText}>#{rank}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default function ResultScreen({ route, navigation }: Props) {
  const { product } = route.params;
  const { pro_riegel, pro_100g, scores } = product;
  const [nutritionView, setNutritionView] = useState<NutritionView>("riegel");
  const nutr = nutritionView === "riegel" ? pro_riegel : pro_100g;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Produktbild */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: getProductImageUrl(product.ean) ?? "" }}
          style={styles.productImage}
          resizeMode="contain"
          defaultSource={require("../assets/images/placeholder.png")}
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.18)"]}
          style={styles.imageGradient}
          pointerEvents="none"
        />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.productName}>{product.name}</Text>
        <View style={styles.metaRow}>
          <View style={styles.shopBadge}>
            <Text style={styles.shopText}>{product.shop}</Text>
          </View>
          <Text style={styles.weightText}>{product.gewicht_g}g</Text>
        </View>
      </View>

      {/* Platzierung */}
      <Text style={styles.sectionTitle}>Platzierung</Text>
      <View style={styles.rankRow}>
        <RankingPill label="Gesamt" rank={product.rank_gesamt} onPress={() => navigation.navigate("Ranking", { rankType: "gesamt", highlightEan: String(product.ean) })} />
        <RankingPill label="Nährwert" rank={product.rank_naehrwert} onPress={() => navigation.navigate("Ranking", { rankType: "naehrwert", highlightEan: String(product.ean) })} />
        <RankingPill label="Geschmack" rank={product.rank_geschmack} onPress={() => navigation.navigate("Ranking", { rankType: "geschmack", highlightEan: String(product.ean) })} />
        <RankingPill label="Preis" rank={product.rank_preis} onPress={() => navigation.navigate("Ranking", { rankType: "preis", highlightEan: String(product.ean) })} />
      </View>

      {/* Scores */}
      <Text style={styles.sectionTitle}>Scores</Text>
      <View style={styles.circleRow}>
        <CircleScore label="Nährwert" value={scores.naehrwert} max={100} color={Colors.info} />
        <CircleScore label="Geschmack" value={product.geschmack} max={10} color={Colors.primary} unit="/10" />
        <CircleScore label="Preis" value={scores.preis} max={100} color={Colors.success} />
      </View>

      {/* Nährwerte */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Nährwerte</Text>
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, nutritionView === "riegel" && styles.toggleBtnActive]}
            onPress={() => setNutritionView("riegel")}
          >
            <Text style={[styles.toggleText, nutritionView === "riegel" && styles.toggleTextActive]}>
              pro Riegel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, nutritionView === "100g" && styles.toggleBtnActive]}
            onPress={() => setNutritionView("100g")}
          >
            <Text style={[styles.toggleText, nutritionView === "100g" && styles.toggleTextActive]}>
              pro 100g
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <NutritionRow label="Eiweiß" value={`${nutr.eiweiss_g}g`} />
        <NutritionRow label="Kalorien" value={`${nutr.kcal} kcal`} />
        <NutritionRow label="Fett" value={`${nutr.fett_g}g`} />
        <NutritionRow label="Kohlenhydrate" value={`${nutr.kohlen_g}g`} />
        <NutritionRow label="Zucker" value={`${nutr.zucker_g}g`} />
        {nutritionView === "riegel" && (
          <NutritionRow label="Preis" value={`${product.preis_eur.toFixed(2)} €`} />
        )}
        {nutritionView === "100g" && (
          <NutritionRow label="Preis" value={`${product.preis_per_100g.toFixed(2)} €`} />
        )}
      </View>

      {/* Weitere Infos */}
      <Text style={styles.sectionTitle}>Weitere Infos</Text>
      <View style={styles.card}>
        <NutritionRow label="Kollagen" value={product.kollagen_pct > 0 ? `${product.kollagen_pct}%` : "Nein"} />
        <NutritionRow label="Palmöl" value={product.palmoil ? "Ja" : "Nein"} />
        <NutritionRow label="Proteinquellen" value={product.proteinquellen.join(", ")} />
      </View>

      <TouchableOpacity
        style={styles.scanAgainButton}
        onPress={() => navigation.replace("Scanner")}
      >
        <Text style={styles.scanAgainText}>Barcode Scannen</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: 48 },
  imageContainer: {
    height: 220, backgroundColor: Colors.surfaceAlt,
    alignItems: "center", justifyContent: "center",
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  productImage: { width: "100%", height: 220 },
  imageGradient: { ...StyleSheet.absoluteFillObject },
  header: { padding: 20, paddingBottom: 8 },
  productName: { fontSize: 20, fontFamily: Fonts.bold, color: Colors.text, marginBottom: 10 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  shopBadge: {
    backgroundColor: Colors.surface, borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: Colors.border,
  },
  shopText: { color: Colors.textSecondary, fontSize: 12, fontFamily: Fonts.semiBold },
  weightText: { color: Colors.textMuted, fontSize: 12, fontFamily: Fonts.medium },
  sectionTitle: {
    fontSize: 11, fontFamily: Fonts.bold, color: Colors.textSecondary,
    letterSpacing: 1.2, textTransform: "uppercase",
    paddingHorizontal: 20, marginTop: 20, marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", paddingHorizontal: 20, marginTop: 20, marginBottom: 10,
  },
  rankRow: { flexDirection: "row", gap: 8, paddingHorizontal: 20 },
  rankPill: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: 12,
    padding: 10, borderWidth: 1.5, alignItems: "center",
  },
  rankPillLabel: { color: Colors.textSecondary, fontSize: 10, fontFamily: Fonts.semiBold, marginBottom: 6 },
  rankBadge: {
    backgroundColor: "#1E1E1E", borderRadius: 20,
    paddingHorizontal: 8, paddingVertical: 3, alignItems: "center",
  },
  rankBadgeText: { color: "#FFFFFF", fontSize: 12, fontFamily: Fonts.bold },
  circleRow: {
    flexDirection: "row", justifyContent: "space-around",
    backgroundColor: Colors.surface, borderRadius: 16,
    paddingVertical: 20, marginHorizontal: 20,
    borderWidth: 1, borderColor: Colors.border,
  },
  toggleRow: { flexDirection: "row", gap: 6 },
  toggleBtn: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8,
    backgroundColor: Colors.background, borderWidth: 1.5, borderColor: Colors.border,
  },
  toggleBtnActive: { borderColor: Colors.primary, backgroundColor: Colors.background },
  toggleText: { color: Colors.textMuted, fontSize: 12, fontFamily: Fonts.semiBold },
  toggleTextActive: { color: Colors.text },
  card: {
    backgroundColor: Colors.surface, borderRadius: 14,
    overflow: "hidden", marginHorizontal: 20,
    borderWidth: 1, borderColor: Colors.border,
  },
  nutritionRow: {
    flexDirection: "row", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 13,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  nutritionLabel: { color: Colors.textSecondary, fontSize: 14, fontFamily: Fonts.regular },
  nutritionValue: {
    color: Colors.text, fontSize: 14, fontFamily: Fonts.semiBold,
    flexShrink: 1, textAlign: "right", marginLeft: 12,
  },
  scanAgainButton: {
    backgroundColor: Colors.primary, borderRadius: 14,
    paddingVertical: 15, alignItems: "center", marginHorizontal: 20, marginTop: 24,
  },
  scanAgainText: { color: Colors.text, fontSize: 15, fontFamily: Fonts.bold },
});
