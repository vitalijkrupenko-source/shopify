import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GradientScreen } from "../../src/components/GradientScreen";
import { Card, SectionTitle, Tag } from "../../src/components/ui";
import { colors, font, radius, spacing } from "../../src/theme";
import { useData, todayISO } from "../../src/state/store";
import { useCoach } from "../../src/coach/useCoach";

const MOODS = [
  { label: "Calm", tint: colors.cyan },
  { label: "Happy", tint: colors.green },
  { label: "Tired", tint: colors.amberSoft },
  { label: "Anxious", tint: colors.violet },
  { label: "Low", tint: colors.blue },
  { label: "Angry", tint: colors.rose },
];

export default function DashboardScreen() {
  const data = useData();
  const { send, thinking } = useCoach();
  const today = todayISO();

  const activeHabits = data.habits.filter((h) => h.active);
  const bestStreak = activeHabits.reduce((m, h) => Math.max(m, h.streak), 0);
  const doneToday = activeHabits.filter((h) => h.completedDates.includes(today)).length;
  const last7 = countCompletionsInLastDays(data, 7);

  const logMood = (mood: string) => {
    if (thinking) return;
    send(`(Mood check-in: I'm feeling ${mood.toLowerCase()} today.)`, { via: "voice" });
  };

  return (
    <GradientScreen aura="ocean" edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.eyebrow}>WHO I'M BECOMING</Text>
        <Text style={styles.title}>Your momentum</Text>

        {/* Momentum stats */}
        <View style={styles.statsRow}>
          <Stat value={`${doneToday}/${activeHabits.length || 0}`} label="today" />
          <Stat value={`${bestStreak}`} label="best streak" tint={colors.amberSoft} />
          <Stat value={`${last7}`} label="done · 7d" tint={colors.green} />
        </View>

        {/* Mood — echoes the reference 'How are you feeling today?' screen */}
        <Card style={{ marginTop: spacing.lg }}>
          <Text style={styles.cardLabel}>HOW ARE YOU FEELING TODAY?</Text>
          <View style={styles.moodWrap}>
            {MOODS.map((m) => (
              <Pressable
                key={m.label}
                onPress={() => logMood(m.label)}
                style={[styles.moodCell, { borderColor: m.tint }]}
              >
                <View style={[styles.moodDot, { backgroundColor: m.tint }]} />
                <Text style={styles.moodText}>{m.label}</Text>
              </Pressable>
            ))}
          </View>
        </Card>

        {/* Identity */}
        <View style={styles.section}>
          <SectionTitle>Who I'm becoming</SectionTitle>
          {data.identityStatements.length === 0 ? (
            <Empty text="No identity statements yet. Your coach will help you shape these in Talk." />
          ) : (
            data.identityStatements.map((i) => (
              <Card key={i.id} style={styles.identityCard}>
                <Ionicons name="leaf-outline" size={16} color={colors.cyan} />
                <Text style={styles.identityText}>{i.text}</Text>
              </Card>
            ))
          )}
        </View>

        {/* Streaks */}
        {activeHabits.length > 0 ? (
          <View style={styles.section}>
            <SectionTitle>Active habits</SectionTitle>
            {activeHabits.map((h) => (
              <View key={h.id} style={styles.streakRow}>
                <Text style={styles.streakTitle}>{h.title}</Text>
                <Tag
                  text={h.streak > 0 ? `🔥 ${h.streak} day${h.streak === 1 ? "" : "s"}` : "start today"}
                  tint={h.streak > 0 ? colors.amberSoft : colors.textFaint}
                />
              </View>
            ))}
          </View>
        ) : null}

        {/* Patterns */}
        <View style={styles.section}>
          <SectionTitle>Patterns noticed</SectionTitle>
          {data.patterns.length === 0 ? (
            <Empty text="As your coach gets to know you, the patterns it spots will collect here." />
          ) : (
            data.patterns.map((p) => (
              <Card key={p.id} style={styles.patternCard}>
                <Ionicons name="git-compare-outline" size={16} color={colors.blue} />
                <Text style={styles.patternText}>{p.description}</Text>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </GradientScreen>
  );
}

function Stat({ value, label, tint = colors.text }: { value: string; label: string; tint?: string }) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, { color: tint }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Empty({ text }: { text: string }) {
  return <Text style={styles.emptyText}>{text}</Text>;
}

function countCompletionsInLastDays(
  data: ReturnType<typeof useData>,
  days: number
): number {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - (days - 1));
  const cutoffISO = cutoff.toISOString().slice(0, 10);
  let n = 0;
  for (const h of data.habits) {
    for (const d of h.completedDates) if (d >= cutoffISO) n += 1;
  }
  return n;
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  eyebrow: { ...font.caption, color: colors.textFaint },
  title: { ...font.display, color: colors.text, marginBottom: spacing.lg },
  statsRow: { flexDirection: "row", gap: spacing.md },
  stat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: "center",
  },
  statValue: { ...font.title, color: colors.text },
  statLabel: { ...font.caption, color: colors.textFaint, marginTop: 4 },
  cardLabel: { ...font.caption, color: colors.textFaint, marginBottom: spacing.md },
  moodWrap: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  moodCell: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  moodDot: { width: 10, height: 10, borderRadius: 5 },
  moodText: { ...font.label, color: colors.text },
  section: { marginTop: spacing.xl },
  identityCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  identityText: { ...font.body, color: colors.text, flex: 1 },
  streakRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  streakTitle: { ...font.body, color: colors.text, flex: 1, marginRight: spacing.md },
  patternCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  patternText: { ...font.body, color: colors.text, flex: 1 },
  emptyText: { ...font.body, color: colors.textFaint },
});
