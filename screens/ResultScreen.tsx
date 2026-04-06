import { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, RankType } from "../App";
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
          source={{ uri: product.image_url ?? getProductImageUrl(product.ean) ?? "" }}
          style={styles.productImage}
          resizeMode="cover"
          defaultSource={require("../assets/images/placeholder.png")}
        />
        {/* Rang-Badge überlappend */}
        <View style={styles.imageBadge}>
          <Text style={styles.imageBadgeRank}>#{product.rank_gesamt}</Text>
        </View>
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

      {/* Scores */}
      <Text style={styles.sectionTitle}>Scores</Text>
      <View style={styles.circleRow}>
        <CircleScore label="Nährwerte" value={scores.naehrwert} max={100} color={Colors.info} />
        <CircleScore label="Geschmack" value={product.geschmack} max={10} color={Colors.primary} unit="/10" />
        <CircleScore label="Preis" value={scores.preis} max={100} color={Colors.success} />
      </View>

      {/* Riegel vergleichen */}
      <View style={styles.compareRow}>
        <TouchableOpacity
          style={styles.compareButton}
          onPress={() => navigation.navigate("Ranking", { rankType: "naehrwert", highlightEan: String(product.ean) })}
          activeOpacity={0.8}
        >
          <Text style={styles.compareButtonText}>Diesen Riegel vergleichen</Text>
        </TouchableOpacity>
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
  },
  productImage: { width: "100%", height: 220 },
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
  compareRow: { paddingHorizontal: 20, marginTop: 16 },
  compareButton: {
    backgroundColor: "#FFFFFF", borderRadius: 16,
    borderWidth: 2, borderColor: Colors.text,
    paddingVertical: 15, alignItems: "center", justifyContent: "center",
  },
  compareButtonText: { color: Colors.text, fontSize: 15, fontFamily: Fonts.bold, letterSpacing: 0.3 },
  imageBadge: {
    position: "absolute", top: 10, left: 10,
    backgroundColor: "#1E1E1E", borderRadius: 50,
    width: 36, height: 36, alignItems: "center", justifyContent: "center",
  },
  imageBadgeRank: { color: "#FFFFFF", fontSize: 12, fontFamily: Fonts.bold },
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
