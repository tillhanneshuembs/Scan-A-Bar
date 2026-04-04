import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { Colors, Fonts } from "../lib/theme";

interface Props {
  label: string;
  value: number;
  max: number;
  color?: string;
  unit?: string;
}

export function CircleScore({ label, value, max, color = Colors.primary, unit }: Props) {
  const size = 90;
  const radius = 36;
  const strokeWidth = 7;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(value / max, 1);
  const dash = pct * circumference;

  return (
    <View style={styles.wrapper}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: "-90deg" }] }}>
        <Circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={Colors.surfaceAlt} strokeWidth={strokeWidth} fill="none"
        />
        <Circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={color} strokeWidth={strokeWidth} fill="none"
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
        />
      </Svg>
      <View style={styles.center}>
        <Text style={[styles.value, { color }]}>
          {unit ? value.toFixed(1) : Math.round(value)}{unit || ""}
        </Text>
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: "center", width: 100 },
  center: {
    position: "absolute", top: 0, left: 0, right: 0,
    height: 90, alignItems: "center", justifyContent: "center",
  },
  value: { fontSize: 15, fontFamily: Fonts.black },
  label: { color: Colors.textSecondary, fontSize: 12, fontFamily: Fonts.medium, marginTop: 6 },
});
