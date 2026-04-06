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
  const [infoOpen, setInfoOpen] = useState(false);

  useEffect(() => {
    setActiveRank(rankType);
    setInfoOpen(false);
  }, [rankType]);

  const handleTabChange = (key: RankType) => {
    setActiveRank(key);
    setTimeout(() => listRef.current?.scrollToOffset({ offset: 0, animated: true }), 50);
  };
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
    return `${item.preis_per_100g.toFixed(2)} €`;
  };

  const getRank = (item: Product) => item[RANK_FIELD[activeRank] as keyof Product] as number;

  const activeTab = RANK_TABS.find((t) => t.key === activeRank);

  const scoreLabel = {
    naehrwert: "Nährwert-Score",
    geschmack: "Geschmacks-Score",
    preis: "Preis/100g",
    gesamt: "Gesamt-Score",
  }[activeRank];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.stickyHeader}>
        <View style={styles.tabs}>
          {RANK_TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeRank === tab.key && styles.tabActive]}
              onPress={() => handleTabChange(tab.key)}
            >
              <Text style={[styles.tabText, activeRank === tab.key && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.listHeader}>
          <Text style={[styles.listHeaderText, { paddingLeft: 12 }]}>Riegel</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text style={styles.listHeaderText}>{scoreLabel}</Text>
            <TouchableOpacity onPress={() => setInfoOpen((v) => !v)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={[styles.infoIcon, infoOpen && styles.infoIconActive]}>ⓘ</Text>
            </TouchableOpacity>
          </View>
        </View>
        {infoOpen && activeTab && (
          <Text style={styles.infoText}>
            {activeTab.infoTitle}{activeTab.info}
          </Text>
        )}
      </View>
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
                <Text style={[styles.productName, isHighlighted && styles.productNameHighlighted]} numberOfLines={3}>
                  {item.name}
                </Text>
                <Text style={styles.shopText}>{item.shop}</Text>
              </View>
              <Text style={[styles.scoreText, { color: isHighlighted ? Colors.text : Colors.textSecondary }]}>
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
  stickyHeader: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
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
    lineHeight: 18, marginBottom: 10, marginTop: 6,
  },
  infoIcon: { fontSize: 14, color: Colors.textMuted },
  infoIconActive: { color: Colors.text },
  listHeader: {
    flexDirection: "row", justifyContent: "space-between",
    paddingHorizontal: 4, paddingBottom: 8, marginTop: 10,
  },
  listHeaderText: {
    fontSize: 11, fontFamily: Fonts.semiBold, color: Colors.textMuted,
    textTransform: "uppercase", letterSpacing: 0.8,
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
    backgroundColor: "#1E1E1E", borderRadius: 50,
    width: 28, height: 28, alignItems: "center", justifyContent: "center",
  },
  rankBadgeHighlighted: { backgroundColor: "#000000" },
  rankBadgeText: { color: "#FFFFFF", fontSize: 10, fontFamily: Fonts.bold },
  nameWrap: { flex: 1, marginLeft: 12, marginRight: 8 },
  productName: { color: Colors.text, fontSize: 13, fontFamily: Fonts.semiBold },
  productNameHighlighted: { color: Colors.text },
  shopText: { color: Colors.textMuted, fontSize: 11, fontFamily: Fonts.medium, marginTop: 2 },
  scoreText: { fontSize: 18, fontFamily: Fonts.bold, width: 80, textAlign: "right", marginRight: 4 },
  separator: { height: 8 },
});
