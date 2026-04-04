import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors, Fonts } from "../lib/theme";

interface Props {
  visible: boolean;
  title: string;
  text: string;
  onClose: () => void;
}

export function InfoModal({ visible, title, text, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose}>
        <View style={styles.sheet}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.text}>{text}</Text>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Schließen</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: Colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 24, paddingBottom: 40,
    borderTopWidth: 1, borderColor: Colors.border,
  },
  title: {
    fontSize: 15, fontFamily: Fonts.bold, color: Colors.text, marginBottom: 12,
  },
  text: {
    fontSize: 14, fontFamily: Fonts.regular, color: Colors.textSecondary,
    lineHeight: 22,
  },
  closeBtn: {
    marginTop: 20, backgroundColor: Colors.primary, borderRadius: 12,
    paddingVertical: 13, alignItems: "center",
  },
  closeBtnText: { color: Colors.text, fontSize: 14, fontFamily: Fonts.bold },
});
