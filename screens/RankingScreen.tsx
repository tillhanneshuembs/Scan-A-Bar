import { useState, useMemo, useRef, useEffect } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  FlatList, SafeAreaView, Image,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList, RankType } from "../App";
import { useProducts, Product } from "../lib/ProductsContext";
import { RANK_TABS, RANK_FIELD } from "../lib/rankTabs";
import { getProductImageUrl } from "../lib/images";
import { Colors, Fonts } from "../lib/theme";

type Props = NativeStackScreenProps<RootStackParamList, "Ranking">;

function rankColor(rank: number) {
  if (rank <= 3) return Colors.gold;
  if (rank <= 10) return Colors.primary;
  return Colors.textSecondary;
}

export default function RankingScreen({ route, navigation }: Props) {
  const { products } = useProducts();
  const { rankType, highlightEan } = route.params;
  const [activeRank, setActiveRank] = useState<RankType>(rankType);
  const listRef = useRef<FlatList>(null);

  const sorted = useMemo(() => {
    const field = RANK_FIELD[activeRank] as keyof Product;
    return [...products].sort((a, b) => (a[field] as number) - (b[field] as number));
  }, [activeRank, products]);

  const highlightIndex = useMemo(
    () => sorted.findIndex((p) => String(p.ean) === String(highlightEan)),
    [sorted, highlightEan]
  );

  useEffect(() => {
    if (highlightIndex >= 0) {
      setTimeout(() => {
        listRef.current?.scrollToIndex({ index: highlightIndex, animated: true, viewPosition: 0.4 });
      }, 300);
    }
  }, [highlightIndex]);

  const getScore = (item: Product) => {
    if (activeRank === "geschmack") return `${item.geschmack.toFixed(1)}/10`;
    if (activeRank === "gesamt") return item.scores.gesamt.toFixed(0);
    if (activeRank === "naehrwert") return item.scores.naehrwert.toFixed(0);
    return item.scores.preis.toFixed(0);
  };

  const getRank = (item: Product) => item[RANK_FIELD[activeRank] as keyof Product] as number;

  const activeTab = RANK_TABS.find((t) => t.key === activeRank);

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        ref={listRef}
        data={sorted}
        keyExtractor={(item) => String(item.ean)}
        contentContainerStyle={styles.content}
        onScrollToIndexFailed={(info) => {
          setTimeout(() => {
            listRef.current?.scrollToIndex({ index: info.index, animated: true, viewPosition: 0.4 });
          }, 500);
        }}
        ListHeaderComponent={
          <View>
            <View style={styles.tabs}>
              {RANK_TABS.map((tab) => (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.tab, activeRank === tab.key && styles.tabActive]}
                  onPress={() => setActiveRank(tab.key)}
                >
                  <Text style={[styles.tabText, activeRank === tab.key && styles.tabTextActive]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {activeTab && (
              <Text style={styles.infoText}>
                {"ⓘ  "}{activeTab.infoTitle}{activeTab.info}
              </Text>
            )}
          </View>
        }
        renderItem={({ item }) => {
          const rank = getRank(item);
          const isHighlighted = String(item.ean) === String(highlightEan);
          return (
            <TouchableOpacity
              style={[styles.row, isHighlighted && styles.rowHighlighted]}
              onPress={() => navigation.navigate("Result", { product: item as any })}
              activeOpacity={0.7}
            >
              <View style={styles.imageWrap}>
                <Image
                  source={{ uri: item.image_url ?? getProductImageUrl(item.ean) ?? "" }}
                  style={styles.productImage}
                  defaultSource={require("../assets/images/placeholder.png")}
                />
                <View style={[styles.rankBadge, isHighlighted && styles.rankBadgeHighlighted]}>
                  <Text style={styles.rankBadgeText}>#{rank}</Text>
                </View>
              </View>
              <View style={styles.nameWrap}>
                <Text style={[styles.productName, isHighlighted && styles.productNameHighlighted]} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.shopText}>{item.shop}</Text>
              </View>
              <Text style={[styles.scoreText, { color: isHighlighted ? Colors.text : Colors.silver }]}>
                {getScore(item)}
              </Text>
            </TouchableOpacity>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 32 },
  tabs: { flexDirection: "row", gap: 8, marginBottom: 10 },
  tab: {
    flex: 1, paddingVertical: 9, borderRadius: 12,
    backgroundColor: Colors.background, alignItems: "center",
    borderWidth: 1.5, borderColor: Colors.border,
  },
  tabActive: { borderColor: Colors.primary },
  tabText: { color: Colors.textSecondary, fontSize: 12, fontFamily: Fonts.semiBold },
  tabTextActive: { color: Colors.text },
  infoText: {
    fontSize: 12, fontFamily: Fonts.regular, color: Colors.textSecondary,
    lineHeight: 18, marginBottom: 14,
  },
  row: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: Colors.surface, borderRadius: 14,
    paddingVertical: 8, paddingHorizontal: 12,
    borderWidth: 1, borderColor: Colors.border,
  },
  rowHighlighted: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryDark,
  },
  imageWrap: {
    width: 100, height: 80, borderRadius: 10,
    backgroundColor: Colors.surfaceAlt, overflow: "hidden",
  },
  productImage: { width: 100, height: 80, resizeMode: "cover" },
  rankBadge: {
    position: "absolute", top: 5, left: 5,
    backgroundColor: "rgba(0,0,0,0.65)", borderRadius: 8,
    paddingHorizontal: 5, paddingVertical: 2,
  },
  rankBadgeHighlighted: { backgroundColor: Colors.primaryDark },
  rankBadgeText: { color: "#FFFFFF", fontSize: 11, fontFamily: Fonts.bold },
  nameWrap: { flex: 1, marginLeft: 12, marginRight: 8 },
  productName: { color: Colors.text, fontSize: 13, fontFamily: Fonts.semiBold },
  productNameHighlighted: { color: Colors.text },
  shopText: { color: Colors.textMuted, fontSize: 11, fontFamily: Fonts.medium, marginTop: 2 },
  scoreText: { fontSize: 14, fontFamily: Fonts.bold, width: 48, textAlign: "right" },
  separator: { height: 8 },
});
