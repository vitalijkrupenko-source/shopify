import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GradientScreen } from "../../src/components/GradientScreen";
import { Conversation } from "../../src/components/Conversation";
import { colors, font, spacing } from "../../src/theme";
import { useData } from "../../src/state/store";
import { useCoach } from "../../src/coach/useCoach";

export default function TalkScreen() {
  const data = useData();
  const { send, thinking } = useCoach();

  const greeting = greetingForTime(data.name);

  const startCheckIn = () => {
    send("(Start a brief check-in with me right now.)", { via: "voice" });
  };

  return (
    <GradientScreen aura="dusk" edges={["top"]}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>YOUR COACH</Text>
          <Text style={styles.title}>{greeting}</Text>
        </View>
        <Pressable onPress={startCheckIn} disabled={thinking} style={styles.checkIn}>
          <Ionicons name="hand-left-outline" size={18} color={colors.violet} />
          <Text style={styles.checkInText}>Check in</Text>
        </Pressable>
      </View>

      <Conversation
        accent={colors.violet}
        emptyHint={
          data.onboarded
            ? "I'm here. Tell me what's on your mind, or tap “Check in” and I'll start us off."
            : "Let's keep going whenever you're ready."
        }
      />
    </GradientScreen>
  );
}

function greetingForTime(name?: string): string {
  const h = new Date().getHours();
  const part = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  return name ? `${part}, ${name}.` : `${part}.`;
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  eyebrow: { ...font.caption, color: colors.textFaint, marginBottom: 4 },
  title: { ...font.title, color: colors.text },
  checkIn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  checkInText: { ...font.label, color: colors.text },
});
