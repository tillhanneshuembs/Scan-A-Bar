import { useState } from "react";
import {
  Modal, View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView, Image, Switch,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Colors, Fonts } from "../lib/theme";

const API_URL = "https://scan-a-bar-backend.vercel.app/api/submissions";

type PalmOil = "yes" | "no" | "unknown";

type Form = {
  name: string; shop: string;
  kcal_riegel: string; fett_riegel: string; kohlen_riegel: string; zucker_riegel: string; eiweiss_riegel: string;
  kcal_100g: string; fett_100g: string; kohlen_100g: string; zucker_100g: string; eiweiss_100g: string;
  preis_eur: string; gewicht_g: string; proteinquellen: string; geschmack: string;
  palmoil: PalmOil;
};

const empty: Form = {
  name: "", shop: "",
  kcal_riegel: "", fett_riegel: "", kohlen_riegel: "", zucker_riegel: "", eiweiss_riegel: "",
  kcal_100g: "", fett_100g: "", kohlen_100g: "", zucker_100g: "", eiweiss_100g: "",
  preis_eur: "", gewicht_g: "", proteinquellen: "", geschmack: "",
  palmoil: "unknown",
};

type ImageState = { uri: string; type: string; name: string } | null;

function Field({ label, value, onChangeText, keyboardType = "default", placeholder }: {
  label: string; value: string; onChangeText: (v: string) => void;
  keyboardType?: "default" | "numeric" | "decimal-pad"; placeholder?: string;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholder={placeholder ?? ""}
        placeholderTextColor={Colors.textMuted}
      />
    </View>
  );
}

function PalmOilPicker({ value, onChange }: { value: PalmOil; onChange: (v: PalmOil) => void }) {
  const options: { val: PalmOil; label: string }[] = [
    { val: "yes", label: "Ja" },
    { val: "no", label: "Nein" },
    { val: "unknown", label: "Weiß nicht" },
  ];
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>Enthält Palmöl</Text>
      <View style={styles.segmentRow}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt.val}
            style={[styles.segmentBtn, value === opt.val && styles.segmentBtnActive]}
            onPress={() => onChange(opt.val)}
            activeOpacity={0.7}
          >
            <Text style={[styles.segmentText, value === opt.val && styles.segmentTextActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function PhotoPicker({ label, description, image, onPick }: {
  label: string; description: string;
  image: ImageState; onPick: () => void;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.photoHint}>{description}</Text>
      <TouchableOpacity style={styles.imagePicker} onPress={onPick} activeOpacity={0.8}>
        {image ? (
          <Image source={{ uri: image.uri }} style={styles.imagePreview} />
        ) : (
          <Text style={styles.imagePickerText}>Foto auswählen</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

export function SubmissionModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [form, setForm] = useState<Form>(empty);
  const [imageFront, setImageFront] = useState<ImageState>(null);
  const [imageBarcode, setImageBarcode] = useState<ImageState>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (key: keyof Form, val: string | PalmOil) =>
    setForm((f) => ({ ...f, [key]: val }));

  const pickImage = async (setter: (img: ImageState) => void) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"], quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setter({ uri: asset.uri, type: "image/jpeg", name: "photo.jpg" });
    }
  };

  const handleSend = async () => {
    if (!canSubmit) return;
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, String(v)));
      if (imageFront) {
        data.append("imageFront", { uri: imageFront.uri, type: imageFront.type, name: "front.jpg" } as any);
      }
      if (imageBarcode) {
        data.append("imageBarcode", { uri: imageBarcode.uri, type: imageBarcode.type, name: "barcode.jpg" } as any);
      }
      await fetch(API_URL, { method: "POST", body: data });
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm(empty);
    setImageFront(null);
    setImageBarcode(null);
    setSent(false);
    onClose();
  };

  const canSubmit = !!(form.name && form.shop && form.preis_eur && form.gewicht_g &&
    form.eiweiss_riegel && form.kcal_riegel && form.eiweiss_100g && form.kcal_100g);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.backdrop}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.sheetWrap}>
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.title}>Neuen Riegel einreichen</Text>
              <TouchableOpacity onPress={handleClose}>
                <Text style={styles.closeX}>✕</Text>
              </TouchableOpacity>
            </View>

            {sent ? (
              <View style={styles.successArea}>
                <Text style={styles.successEmoji}>✓</Text>
                <Text style={styles.successTitle}>Danke für deine Einreichung!</Text>
                <Text style={styles.successSub}>Wir prüfen den Riegel und schalten ihn frei.</Text>
                <TouchableOpacity style={styles.sendButton} onPress={handleClose}>
                  <Text style={styles.sendButtonText}>Schließen</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                <Text style={styles.section}>Allgemein</Text>
                <Field label="Name *" value={form.name} onChangeText={(v) => set("name", v)} placeholder="z.B. Crispy Stracciatella 50%" />
                <Field label="Shop *" value={form.shop} onChangeText={(v) => set("shop", v)} placeholder="z.B. DM, Lidl, Rossmann" />
                <Field label="Gewicht (g) *" value={form.gewicht_g} onChangeText={(v) => set("gewicht_g", v)} keyboardType="decimal-pad" placeholder="z.B. 45" />
                <Field label="Preis (€) *" value={form.preis_eur} onChangeText={(v) => set("preis_eur", v)} keyboardType="decimal-pad" placeholder="z.B. 1.29" />

                <Text style={styles.section}>Nährwerte pro Riegel</Text>
                <Field label="Eiweiß (g) *" value={form.eiweiss_riegel} onChangeText={(v) => set("eiweiss_riegel", v)} keyboardType="decimal-pad" />
                <Field label="Kalorien (kcal) *" value={form.kcal_riegel} onChangeText={(v) => set("kcal_riegel", v)} keyboardType="decimal-pad" />
                <Field label="Fett (g)" value={form.fett_riegel} onChangeText={(v) => set("fett_riegel", v)} keyboardType="decimal-pad" />
                <Field label="Kohlenhydrate (g)" value={form.kohlen_riegel} onChangeText={(v) => set("kohlen_riegel", v)} keyboardType="decimal-pad" />
                <Field label="Zucker (g)" value={form.zucker_riegel} onChangeText={(v) => set("zucker_riegel", v)} keyboardType="decimal-pad" />

                <Text style={styles.section}>Nährwerte pro 100g</Text>
                <Field label="Eiweiß (g) *" value={form.eiweiss_100g} onChangeText={(v) => set("eiweiss_100g", v)} keyboardType="decimal-pad" />
                <Field label="Kalorien (kcal) *" value={form.kcal_100g} onChangeText={(v) => set("kcal_100g", v)} keyboardType="decimal-pad" />
                <Field label="Fett (g)" value={form.fett_100g} onChangeText={(v) => set("fett_100g", v)} keyboardType="decimal-pad" />
                <Field label="Kohlenhydrate (g)" value={form.kohlen_100g} onChangeText={(v) => set("kohlen_100g", v)} keyboardType="decimal-pad" />
                <Field label="Zucker (g)" value={form.zucker_100g} onChangeText={(v) => set("zucker_100g", v)} keyboardType="decimal-pad" />

                <Text style={styles.section}>Weitere Infos</Text>
                <Field label="Geschmack (0–10)" value={form.geschmack} onChangeText={(v) => set("geschmack", v)} keyboardType="decimal-pad" placeholder="z.B. 7.5" />
                <Field label="Proteinquellen" value={form.proteinquellen} onChangeText={(v) => set("proteinquellen", v)} placeholder="z.B. Molke, Soja (kommagetrennt)" />
                <PalmOilPicker value={form.palmoil} onChange={(v) => set("palmoil", v)} />

                <Text style={styles.section}>Fotos</Text>
                <PhotoPicker
                  label="Frontfoto"
                  description="Zeige den Riegel klar und deutlich von vorne, sodass Name und Marke gut lesbar sind."
                  image={imageFront}
                  onPick={() => pickImage(setImageFront)}
                />
                <PhotoPicker
                  label="Barcode-Foto"
                  description="Fotografiere den Barcode auf der Rückseite oder Seite des Riegels – wir tragen die EAN dann nach."
                  image={imageBarcode}
                  onPick={() => pickImage(setImageBarcode)}
                />

                <Text style={styles.consent}>
                  Mit dem Einreichen stimmst du unserer{" "}
                  <Text style={styles.consentLink}>Datenschutzerklärung</Text>
                  {" "}zu. Bitte stelle sicher, dass deine Fotos keine Personen zeigen.
                </Text>

                <TouchableOpacity
                  style={[styles.sendButton, !canSubmit && styles.sendButtonDisabled]}
                  onPress={handleSend}
                  disabled={!canSubmit || loading}
                  activeOpacity={0.8}
                >
                  {loading ? <ActivityIndicator color={Colors.text} /> : <Text style={styles.sendButtonText}>Einreichen</Text>}
                </TouchableOpacity>
                <View style={{ height: 32 }} />
              </ScrollView>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
  sheetWrap: { flex: 1, justifyContent: "flex-end" },
  sheet: {
    backgroundColor: "#FFFFFF", borderTopLeftRadius: 24, borderTopRightRadius: 24,
    maxHeight: "92%",
  },
  sheetHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    padding: 20, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  title: { fontSize: 17, fontFamily: Fonts.bold, color: Colors.text },
  closeX: { fontSize: 16, color: Colors.textMuted, paddingHorizontal: 4 },
  scroll: { paddingHorizontal: 20 },
  section: {
    fontSize: 11, fontFamily: Fonts.bold, color: Colors.textSecondary,
    letterSpacing: 1, textTransform: "uppercase", marginTop: 20, marginBottom: 8,
  },
  field: { marginBottom: 10 },
  fieldLabel: { fontSize: 12, fontFamily: Fonts.medium, color: Colors.textSecondary, marginBottom: 4 },
  input: {
    backgroundColor: Colors.surface, borderRadius: 10, borderWidth: 1,
    borderColor: Colors.border, paddingHorizontal: 12, paddingVertical: 10,
    fontSize: 14, fontFamily: Fonts.regular, color: Colors.text,
  },
  segmentRow: { flexDirection: "row", gap: 8 },
  segmentBtn: {
    flex: 1, paddingVertical: 9, borderRadius: 10, borderWidth: 1,
    borderColor: Colors.border, backgroundColor: Colors.surface, alignItems: "center",
  },
  segmentBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  segmentText: { fontSize: 13, fontFamily: Fonts.medium, color: Colors.textSecondary },
  segmentTextActive: { color: Colors.text, fontFamily: Fonts.bold },
  photoHint: { fontSize: 12, fontFamily: Fonts.regular, color: Colors.textMuted, marginBottom: 6 },
  imagePicker: {
    height: 120, backgroundColor: Colors.surface, borderRadius: 12,
    borderWidth: 1, borderColor: Colors.border, borderStyle: "dashed",
    alignItems: "center", justifyContent: "center", overflow: "hidden",
  },
  imagePreview: { width: "100%", height: "100%", resizeMode: "cover" },
  imagePickerText: { fontSize: 14, fontFamily: Fonts.medium, color: Colors.textMuted },
  sendButton: {
    backgroundColor: Colors.primary, borderRadius: 14,
    paddingVertical: 15, alignItems: "center", marginTop: 8,
  },
  sendButtonDisabled: { opacity: 0.4 },
  sendButtonText: { color: Colors.text, fontSize: 15, fontFamily: Fonts.bold },
  successArea: { alignItems: "center", padding: 32 },
  successEmoji: { fontSize: 40, color: Colors.primary, marginBottom: 12 },
  successTitle: { fontSize: 18, fontFamily: Fonts.bold, color: Colors.text, marginBottom: 6 },
  successSub: { fontSize: 13, fontFamily: Fonts.regular, color: Colors.textSecondary, marginBottom: 24, textAlign: "center" },
  consent: { fontSize: 11, fontFamily: Fonts.regular, color: Colors.textMuted, marginTop: 12, marginBottom: 8, lineHeight: 16 },
  consentLink: { textDecorationLine: "underline" },
});
