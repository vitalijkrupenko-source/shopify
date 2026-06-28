import React, { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { GradientScreen } from "../src/components/GradientScreen";
import { Conversation } from "../src/components/Conversation";
import { PrimaryButton } from "../src/components/ui";
import { colors, font, radius, spacing } from "../src/theme";
import { useData, useStore, newId } from "../src/state/store";
import { useCoach } from "../src/coach/useCoach";

export default function Onboarding() {
  const data = useData();
  const { dispatch } = useStore();
  const { send } = useCoach();
  const [phase, setPhase] = useState<"intro" | "chat">("intro");
  const [name, setName] = useState(data.name ?? "");

  const captured =
    data.identityStatements.length + data.aims.length + data.habits.length;

  // Kick off the discovery with a coach-initiated opener the first time.
  useEffect(() => {
    if (phase === "chat" && data.conversation.length === 0) {
      send("(I just opened the app for the first time. Begin the discovery.)", {
        onboarding: true,
        via: "voice",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const begin = () => {
    if (name.trim()) {
      dispatch({ type: "PATCH", patch: { name: name.trim() } });
    }
    setPhase("chat");
  };

  const finish = () => {
    dispatch({ type: "PATCH", patch: { onboarded: true } });
    router.replace("/(tabs)");
  };

  if (phase === "intro") {
    return (
      <GradientScreen aura="warm" edges={["top", "bottom"]}>
        <ScrollView contentContainerStyle={styles.introScroll}>
          <View style={styles.dots}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>

          <View style={styles.heroIcon}>
            <Ionicons name="compass-outline" size={30} color={colors.amber} />
          </View>

          <Text style={styles.hero}>Let's figure out where you're trying to go.</Text>
          <Text style={styles.sub}>
            I'm your coach. Before anything else, I want to understand who you're trying to
            become — then we'll make today serve that. This is a conversation, not a form, and
            we can pick it up across as many sittings as you need.
          </Text>

          <View style={styles.nameWrap}>
            <Text style={styles.nameLabel}>What should I call you?</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor={colors.textFaint}
              style={styles.nameInput}
              returnKeyType="done"
              onSubmitEditing={begin}
            />
          </View>

          <View style={{ height: spacing.xl }} />
          <PrimaryButton
            label="Begin"
            gradient={[colors.amber, colors.amberSoft]}
            onPress={begin}
          />
          <Text style={styles.footNote}>Step 1 of 3 · Discovery</Text>
        </ScrollView>
      </GradientScreen>
    );
  }

  return (
    <GradientScreen aura="warm" edges={["top"]}>
      <View style={styles.chatHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.chatTitle}>Discovery</Text>
          <Text style={styles.chatSub}>
            {captured === 0
              ? "Talk it through — I'll capture what matters."
              : `${captured} thing${captured === 1 ? "" : "s"} captured so far`}
          </Text>
        </View>
        <Pressable onPress={finish} style={styles.finishBtn}>
          <Text style={styles.finishText}>Enter app</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.onAccent} />
        </Pressable>
      </View>

      <Conversation
        accent={colors.amber}
        onboarding
        emptyHint="Take a breath. We'll start wherever feels right."
      />
    </GradientScreen>
  );
}

const styles = StyleSheet.create({
  introScroll: { padding: spacing.xl, paddingTop: spacing.xxl, flexGrow: 1 },
  dots: { flexDirection: "row", gap: 6, marginBottom: spacing.xxl },
  dot: { width: 22, height: 4, borderRadius: 2, backgroundColor: colors.surfaceStrong },
  dotActive: { backgroundColor: colors.amber, width: 30 },
  heroIcon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
  },
  hero: { ...font.display, color: colors.text, marginBottom: spacing.lg },
  sub: { ...font.body, color: colors.textMuted, marginBottom: spacing.xl },
  nameWrap: { marginTop: spacing.sm },
  nameLabel: { ...font.label, color: colors.textMuted, marginBottom: spacing.sm },
  nameInput: {
    ...font.body,
    color: colors.text,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  footNote: { ...font.caption, color: colors.textFaint, textAlign: "center", marginTop: spacing.lg },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  chatTitle: { ...font.title, color: colors.text },
  chatSub: { ...font.caption, color: colors.textFaint, marginTop: 2 },
  finishBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.amber,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.pill,
  },
  finishText: { ...font.label, color: colors.onAccent },
});
