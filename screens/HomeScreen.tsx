import { useState, useMemo } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  FlatList, SafeAreaView, Image,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import products from "../assets/products.json";
import { getProductImageUrl } from "../lib/images";
import { Colors, Fonts } from "../lib/theme";

type RankType = "gesamt" | "naehrwert" | "geschmack" | "preis";
type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const INITIAL_COUNT = 5;

const RANK_TABS: { key: RankType; label: string }[] = [
  { key: "gesamt", label: "Gesamt" },
  { key: "naehrwert", label: "Nährwert" },
  { key: "geschmack", label: "Geschmack" },
  { key: "preis", label: "Preis" },
];

const RANK_FIELD: Record<RankType, keyof typeof products[0]> = {
  gesamt: "rank_gesamt",
  naehrwert: "rank_naehrwert",
  geschmack: "rank_geschmack",
  preis: "rank_preis",
};


function rankColor(rank: number) {
  if (rank === 1) return Colors.gold;
  if (rank === 2) return Colors.silver;
  if (rank === 3) return Colors.bronze;
  if (rank <= 10) return Colors.primary;
  return Colors.textSecondary;
}

export default function HomeScreen({ navigation }: Props) {
  const [activeRank, setActiveRank] = useState<RankType>("gesamt");
  const [showAll, setShowAll] = useState(false);

  const sorted = useMemo(() => {
    const field = RANK_FIELD[activeRank];
    return [...products].sort((a, b) => (a[field] as number) - (b[field] as number));
  }, [activeRank]);

  const visible = showAll ? sorted : sorted.slice(0, INITIAL_COUNT);

  const getScore = (item: typeof products[0]) => {
    if (activeRank === "geschmack") return `${item.geschmack.toFixed(1)}/10`;
    if (activeRank === "gesamt") return item.scores.gesamt.toFixed(0);
    if (activeRank === "naehrwert") return item.scores.naehrwert.toFixed(0);
    return item.scores.preis.toFixed(0);
  };

  const getRank = (item: typeof products[0]) => item[RANK_FIELD[activeRank]] as number;

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={visible}
        keyExtractor={(item) => String(item.ean)}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View>
            {/* Tabs */}
            <View style={styles.tabs}>
              {RANK_TABS.map((tab) => (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.tab, activeRank === tab.key && styles.tabActive]}
                  onPress={() => { setActiveRank(tab.key); setShowAll(false); }}
                >
                  <Text style={[styles.tabText, activeRank === tab.key && styles.tabTextActive]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        }
        renderItem={({ item }) => {
          const rank = getRank(item);
          return (
            <TouchableOpacity
              style={styles.row}
              onPress={() => navigation.navigate("Result", { product: item as any })}
              activeOpacity={0.7}
            >
              <View style={styles.rankCell}>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankBadgeText}>#{rank}</Text>
                </View>
              </View>
              <View style={styles.imageWrap}>
                <Image
                  source={{ uri: getProductImageUrl(item.ean) ?? "" }}
                  style={styles.productImage}
                  defaultSource={require("../assets/images/placeholder.png")}
                />
              </View>
              <View style={styles.nameWrap}>
                <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.shopText}>{item.shop}</Text>
              </View>
              <Text style={[styles.scoreText, { color: rankColor(rank) }]}>
                {getScore(item)}
              </Text>
            </TouchableOpacity>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={
          !showAll ? (
            <TouchableOpacity
              style={styles.loadMoreButton}
              onPress={() => setShowAll(true)}
            >
              <Text style={styles.loadMoreText}>
                Alle anzeigen ({sorted.length - INITIAL_COUNT} weitere)
              </Text>
            </TouchableOpacity>
          ) : <View style={{ height: 16 }} />
        }
      />

      {/* Fixierter Scan-Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => navigation.navigate("Scanner")}
        >
          <Text style={styles.scanButtonText}>Barcode Scannen</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 8 },
  tabs: { flexDirection: "row", gap: 8, marginBottom: 16 },
  tab: {
    flex: 1, paddingVertical: 9, borderRadius: 12,
    backgroundColor: Colors.background, alignItems: "center",
    borderWidth: 1.5, borderColor: Colors.border,
  },
  tabActive: { backgroundColor: Colors.background, borderColor: Colors.primary },
  tabText: { color: Colors.textSecondary, fontSize: 12, fontFamily: Fonts.semiBold },
  tabTextActive: { color: Colors.text },
  row: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: Colors.surface, borderRadius: 14,
    paddingVertical: 12, paddingHorizontal: 14,
    borderWidth: 1, borderColor: Colors.border,
  },
  rankCell: { width: 44, alignItems: "center" },
  rankBadge: {
    backgroundColor: "#1E1E1E", borderRadius: 20,
    paddingHorizontal: 6, paddingVertical: 3, minWidth: 36, alignItems: "center",
  },
  rankBadgeText: { color: "#FFFFFF", fontSize: 11, fontFamily: Fonts.bold },
  imageWrap: {
    width: 42, height: 42, borderRadius: 10,
    backgroundColor: Colors.surfaceAlt, overflow: "hidden",
    marginLeft: 10,
  },
  productImage: { width: 42, height: 42 },
  nameWrap: { flex: 1, marginLeft: 12 },
  productName: { color: Colors.text, fontSize: 13, fontFamily: Fonts.semiBold },
  shopText: { color: Colors.textMuted, fontSize: 11, fontFamily: Fonts.medium, marginTop: 2 },
  scoreText: { fontSize: 14, fontFamily: Fonts.bold, width: 48, textAlign: "right" },
  separator: { height: 8 },
  loadMoreButton: {
    marginTop: 12, backgroundColor: Colors.background, borderRadius: 12,
    paddingVertical: 14, alignItems: "center",
    borderWidth: 1.5, borderColor: Colors.primary,
  },
  loadMoreText: { color: Colors.text, fontSize: 13, fontFamily: Fonts.semiBold },
  bottomBar: {
    paddingHorizontal: 16, paddingVertical: 12,
    borderTopWidth: 1, borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  scanButton: {
    backgroundColor: Colors.primary, borderRadius: 14,
    paddingVertical: 15, alignItems: "center",
  },
  scanButtonText: { color: Colors.text, fontSize: 16, fontFamily: Fonts.bold },
});
