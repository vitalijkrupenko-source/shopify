import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GradientScreen } from "../../src/components/GradientScreen";
import { Card, Pill, PrimaryButton, SectionTitle } from "../../src/components/ui";
import { colors, font, radius, spacing } from "../../src/theme";
import { useData, useStore, newId } from "../../src/state/store";
import { DOMAIN_LABELS, type LifeDomain } from "../../src/state/types";

const DOMAINS: LifeDomain[] = [
  "identity",
  "career",
  "money",
  "health",
  "relationships",
  "lifestyle",
  "location",
  "learning",
  "mind",
];

export default function GoalsScreen() {
  const data = useData();
  const { dispatch } = useStore();
  const [modal, setModal] = useState<null | "identity" | "aim">(null);
  const [draft, setDraft] = useState("");
  const [domain, setDomain] = useState<LifeDomain>("career");

  const closeModal = () => {
    setModal(null);
    setDraft("");
  };

  const saveModal = () => {
    const text = draft.trim();
    if (!text) return closeModal();
    if (modal === "identity") {
      dispatch({ type: "ADD_IDENTITY", statement: { id: newId(), text, createdAt: Date.now() } });
    } else if (modal === "aim") {
      dispatch({ type: "ADD_AIM", aim: { id: newId(), domain, text } });
    }
    closeModal();
  };

  const s = data.settings;

  return (
    <GradientScreen aura="dusk" edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.eyebrow}>GOALS & IDENTITY</Text>
        <Text style={styles.title}>Your model</Text>
        <Text style={styles.sub}>
          The living picture your coach reasons over. Edit it here, or just talk it through in Talk.
        </Text>

        {/* Identity statements */}
        <View style={styles.section}>
          <SectionTitle>
            Identity statements
          </SectionTitle>
          {data.identityStatements.map((i) => (
            <Card key={i.id} style={styles.rowCard}>
              <Ionicons name="leaf-outline" size={16} color={colors.violet} />
              <Text style={styles.rowText}>{i.text}</Text>
            </Card>
          ))}
          <AddButton label="Add identity statement" onPress={() => setModal("identity")} />
        </View>

        {/* Aims grouped by domain */}
        <View style={styles.section}>
          <SectionTitle>Aims</SectionTitle>
          {data.aims.length === 0 ? (
            <Text style={styles.empty}>Nothing here yet.</Text>
          ) : (
            data.aims.map((a) => (
              <Card key={a.id} style={styles.aimCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.aimDomain}>{DOMAIN_LABELS[a.domain].toUpperCase()}</Text>
                  <Text style={styles.rowText}>{a.text}</Text>
                  {a.target ? <Text style={styles.aimTarget}>Target · {a.target}</Text> : null}
                </View>
                <Pressable onPress={() => dispatch({ type: "REMOVE_AIM", id: a.id })} hitSlop={10}>
                  <Ionicons name="close-circle" size={20} color={colors.textFaint} />
                </Pressable>
              </Card>
            ))
          )}
          <AddButton label="Add an aim" onPress={() => setModal("aim")} />
        </View>

        {/* Settings — a slice of the §11 dials */}
        <View style={styles.section}>
          <SectionTitle>Coach settings</SectionTitle>
          <Card>
            <DialRow label="Tone">
              {(["calm", "warm", "direct", "adaptive"] as const).map((v) => (
                <Pill
                  key={v}
                  label={v}
                  active={s.tone === v}
                  tint={colors.violet}
                  onPress={() => dispatch({ type: "UPDATE_SETTINGS", patch: { tone: v } })}
                />
              ))}
            </DialRow>
            <DialRow label="Challenge">
              {(["low", "medium", "high"] as const).map((v) => (
                <Pill
                  key={v}
                  label={v}
                  active={s.challenge === v}
                  tint={colors.violet}
                  onPress={() => dispatch({ type: "UPDATE_SETTINGS", patch: { challenge: v } })}
                />
              ))}
            </DialRow>
            <Toggle
              label="Speak replies aloud"
              value={s.voiceReplies}
              onToggle={() => dispatch({ type: "UPDATE_SETTINGS", patch: { voiceReplies: !s.voiceReplies } })}
            />
            <Toggle
              label="Morning check-in"
              value={s.morningCheckIn}
              onToggle={() => dispatch({ type: "UPDATE_SETTINGS", patch: { morningCheckIn: !s.morningCheckIn } })}
            />
            <Toggle
              label="Evening reflection"
              value={s.eveningCheckIn}
              onToggle={() => dispatch({ type: "UPDATE_SETTINGS", patch: { eveningCheckIn: !s.eveningCheckIn } })}
            />
          </Card>
        </View>

        <Pressable
          onPress={() => dispatch({ type: "RESET" })}
          style={styles.reset}
        >
          <Ionicons name="refresh-outline" size={16} color={colors.danger} />
          <Text style={styles.resetText}>Reset everything</Text>
        </Pressable>
      </ScrollView>

      {/* Add modal */}
      <Modal visible={modal !== null} transparent animationType="fade" onRequestClose={closeModal}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {modal === "identity" ? "New identity statement" : "New aim"}
            </Text>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder={
                modal === "identity"
                  ? "someone who is calm and present with my family"
                  : "what you're working toward"
              }
              placeholderTextColor={colors.textFaint}
              style={styles.modalInput}
              multiline
              autoFocus
            />
            {modal === "aim" ? (
              <View style={styles.domainWrap}>
                {DOMAINS.map((d) => (
                  <Pill
                    key={d}
                    label={DOMAIN_LABELS[d]}
                    active={domain === d}
                    tint={colors.violet}
                    onPress={() => setDomain(d)}
                  />
                ))}
              </View>
            ) : null}
            <View style={styles.modalActions}>
              <Pressable onPress={closeModal} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <View style={{ flex: 1 }}>
                <PrimaryButton label="Save" gradient={[colors.violet, colors.blue]} onPress={saveModal} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </GradientScreen>
  );
}

function AddButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.addBtn}>
      <Ionicons name="add" size={18} color={colors.textMuted} />
      <Text style={styles.addText}>{label}</Text>
    </Pressable>
  );
}

function DialRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.dialRow}>
      <Text style={styles.dialLabel}>{label}</Text>
      <View style={styles.dialPills}>{children}</View>
    </View>
  );
}

function Toggle({ label, value, onToggle }: { label: string; value: boolean; onToggle: () => void }) {
  return (
    <Pressable onPress={onToggle} style={styles.toggleRow}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <View style={[styles.switch, value ? { backgroundColor: colors.violet } : null]}>
        <View style={[styles.knob, value ? { alignSelf: "flex-end" } : null]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  eyebrow: { ...font.caption, color: colors.textFaint },
  title: { ...font.display, color: colors.text },
  sub: { ...font.body, color: colors.textMuted, marginTop: spacing.sm, marginBottom: spacing.sm },
  section: { marginTop: spacing.xl },
  rowCard: { flexDirection: "row", alignItems: "flex-start", gap: spacing.md, marginBottom: spacing.sm },
  rowText: { ...font.body, color: colors.text, flex: 1 },
  aimCard: { flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.sm },
  aimDomain: { ...font.caption, color: colors.textFaint, marginBottom: 2 },
  aimTarget: { ...font.caption, color: colors.amberSoft, marginTop: 4 },
  empty: { ...font.body, color: colors.textFaint, marginBottom: spacing.sm },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
  },
  addText: { ...font.label, color: colors.textMuted },
  dialRow: { marginBottom: spacing.lg },
  dialLabel: { ...font.label, color: colors.textMuted, marginBottom: spacing.sm },
  dialPills: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  toggleLabel: { ...font.body, color: colors.text },
  switch: {
    width: 46,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceStrong,
    padding: 3,
    justifyContent: "center",
  },
  knob: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.text },
  reset: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
  },
  resetText: { ...font.label, color: colors.danger },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
    padding: spacing.lg,
  },
  modalCard: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    gap: spacing.md,
  },
  modalTitle: { ...font.heading, color: colors.text },
  modalInput: {
    ...font.body,
    color: colors.text,
    minHeight: 60,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  domainWrap: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  modalActions: { flexDirection: "row", alignItems: "center", gap: spacing.md, marginTop: spacing.sm },
  cancelBtn: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  cancelText: { ...font.label, color: colors.textMuted },
});
