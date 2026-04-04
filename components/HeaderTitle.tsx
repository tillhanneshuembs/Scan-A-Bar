import { View, Text } from "react-native";
import { Fonts, Colors } from "../lib/theme";

export function HeaderTitle({ title }: { title?: string }) {
  return (
    <View style={{ alignItems: "center" }}>
      <Text style={{ fontFamily: Fonts.bold, fontSize: 17, color: Colors.text }}>
        {title ?? "Scan-A-Bar"}
      </Text>
      <Text style={{ fontFamily: Fonts.medium, fontSize: 10, color: Colors.textMuted, marginTop: 1 }}>
        by Supplemania
      </Text>
    </View>
  );
}
