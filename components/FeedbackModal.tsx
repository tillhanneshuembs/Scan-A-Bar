import { useState } from "react";
import {
  Modal, View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator,
} from "react-native";
import { Colors, Fonts } from "../lib/theme";

const API_URL = "https://scan-a-bar-backend.vercel.app/api/feedback";

export function FeedbackModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    setLoading(true);
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setMessage("");
    setSent(false);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={handleClose}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <TouchableOpacity activeOpacity={1}>
            <View style={styles.sheet}>
              {sent ? (
                <View style={styles.successArea}>
                  <Text style={styles.successEmoji}>✓</Text>
                  <Text style={styles.successTitle}>Danke für dein Feedback!</Text>
                  <Text style={styles.successSub}>Wir schauen uns das an.</Text>
                  <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                    <Text style={styles.closeButtonText}>Schließen</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <Text style={styles.title}>Feedback senden</Text>
                  <Text style={styles.subtitle}>
                    Fehlt ein Riegel oder hast du einen Fehler entdeckt?
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Deine Nachricht..."
                    placeholderTextColor={Colors.textMuted}
                    value={message}
                    onChangeText={setMessage}
                    multiline
                    maxLength={1000}
                    autoFocus
                  />
                  <Text style={styles.charCount}>{message.length}/1000</Text>
                  <TouchableOpacity
                    style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
                    onPress={handleSend}
                    disabled={!message.trim() || loading}
                    activeOpacity={0.8}
                  >
                    {loading ? (
                      <ActivityIndicator color={Colors.text} />
                    ) : (
                      <Text style={styles.sendButtonText}>Absenden</Text>
                    )}
                  </TouchableOpacity>
                </>
              )}
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
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
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 40,
  },
  title: { fontSize: 18, fontFamily: Fonts.bold, color: Colors.text, marginBottom: 6 },
  subtitle: { fontSize: 13, fontFamily: Fonts.regular, color: Colors.textSecondary, marginBottom: 16 },
  input: {
    backgroundColor: Colors.surface, borderRadius: 12,
    borderWidth: 1, borderColor: Colors.border,
    padding: 14, fontSize: 14, fontFamily: Fonts.regular,
    color: Colors.text, minHeight: 100, textAlignVertical: "top",
  },
  charCount: {
    fontSize: 11, fontFamily: Fonts.regular, color: Colors.textMuted,
    textAlign: "right", marginTop: 4, marginBottom: 16,
  },
  sendButton: {
    backgroundColor: Colors.primary, borderRadius: 14,
    paddingVertical: 15, alignItems: "center",
  },
  sendButtonDisabled: { opacity: 0.4 },
  sendButtonText: { color: Colors.text, fontSize: 15, fontFamily: Fonts.bold },
  successArea: { alignItems: "center", paddingVertical: 16 },
  successEmoji: { fontSize: 40, marginBottom: 12, color: Colors.primary },
  successTitle: { fontSize: 18, fontFamily: Fonts.bold, color: Colors.text, marginBottom: 6 },
  successSub: { fontSize: 13, fontFamily: Fonts.regular, color: Colors.textSecondary, marginBottom: 24 },
  closeButton: {
    backgroundColor: Colors.primary, borderRadius: 14,
    paddingVertical: 14, paddingHorizontal: 40, alignItems: "center",
  },
  closeButtonText: { color: Colors.text, fontSize: 15, fontFamily: Fonts.bold },
});
