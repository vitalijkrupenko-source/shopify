import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { GradientScreen } from "../../src/components/GradientScreen";
import { Card, SectionTitle } from "../../src/components/ui";
import { colors, font, radius, spacing } from "../../src/theme";
import { useData, useStore, todayISO } from "../../src/state/store";
import type { Habit } from "../../src/state/types";

export default function TodayScreen() {
  const data = useData();
  const { dispatch } = useStore();
  const today = todayISO();

  const activeHabits = data.habits.filter((h) => h.active);
  const openTasks = data.tasks.filter(
    (t) => t.state === "open" && (!t.snoozedUntil || t.snoozedUntil <= today)
  );
  const intention =
    data.todayIntention?.date === today ? data.todayIntention.text : undefined;

  const doneCount = activeHabits.filter((h) => h.completedDates.includes(today)).length;

  const toggleHabit = (h: Habit) => {
    Haptics.selectionAsync();
    dispatch({ type: "TOGGLE_HABIT_TODAY", id: h.id });
  };

  const completeTask = (id: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    dispatch({ type: "UPDATE_TASK", id, patch: { state: "done" } });
  };

  const snoozeTask = (id: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dispatch({
      type: "UPDATE_TASK",
      id,
      patch: { state: "open", snoozedUntil: tomorrow.toISOString().slice(0, 10) },
    });
  };

  return (
    <GradientScreen aura="forest" edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.eyebrow}>{new Date().toDateString().toUpperCase()}</Text>
        <Text style={styles.title}>Today</Text>

        {/* Intention */}
        <Card style={styles.intentionCard}>
          <View style={styles.intentionHead}>
            <Ionicons name="sparkles-outline" size={16} color={colors.green} />
            <Text style={styles.intentionLabel}>TODAY'S INTENTION</Text>
          </View>
          <Text style={styles.intentionText}>
            {intention ??
              "No intention set yet. Open Talk and ask your coach to help you set one."}
          </Text>
        </Card>

        {/* Habits */}
        <View style={styles.sectionWrap}>
          <SectionTitle hint={`${doneCount}/${activeHabits.length} done`}>Habits</SectionTitle>
          {activeHabits.length === 0 ? (
            <EmptyLine text="No habits yet — they'll appear here as you and your coach create them." />
          ) : (
            activeHabits.map((h) => {
              const done = h.completedDates.includes(today);
              return (
                <Pressable key={h.id} onPress={() => toggleHabit(h)} style={styles.itemRow}>
                  <View
                    style={[
                      styles.check,
                      done ? { backgroundColor: colors.green, borderColor: colors.green } : null,
                    ]}
                  >
                    {done ? <Ionicons name="checkmark" size={16} color={colors.onAccent} /> : null}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.itemTitle, done ? styles.struck : null]}>{h.title}</Text>
                    <Text style={styles.itemMeta}>
                      {h.cadence}
                      {h.timeHint ? ` · ${h.timeHint}` : ""}
                      {h.streak > 0 ? ` · 🔥 ${h.streak}` : ""}
                    </Text>
                  </View>
                </Pressable>
              );
            })
          )}
        </View>

        {/* Reminders */}
        <View style={styles.sectionWrap}>
          <SectionTitle hint={`${openTasks.length} open`}>Reminders</SectionTitle>
          {openTasks.length === 0 ? (
            <EmptyLine text="Nothing pending. Ask your coach to remind you of something." />
          ) : (
            openTasks.map((t) => (
              <View key={t.id} style={styles.itemRow}>
                <Pressable onPress={() => completeTask(t.id)} style={styles.check}>
                  <Ionicons name="ellipse-outline" size={16} color={colors.textFaint} />
                </Pressable>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{t.title}</Text>
                  {t.due ? <Text style={styles.itemMeta}>due {t.due}</Text> : null}
                </View>
                <Pressable onPress={() => snoozeTask(t.id)} style={styles.snooze}>
                  <Text style={styles.snoozeText}>Not today</Text>
                </Pressable>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </GradientScreen>
  );
}

function EmptyLine({ text }: { text: string }) {
  return (
    <View style={styles.emptyLine}>
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.md },
  eyebrow: { ...font.caption, color: colors.textFaint },
  title: { ...font.display, color: colors.text, marginBottom: spacing.md },
  intentionCard: { borderColor: colors.border },
  intentionHead: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: spacing.sm },
  intentionLabel: { ...font.caption, color: colors.green },
  intentionText: { ...font.body, color: colors.text },
  sectionWrap: { marginTop: spacing.lg },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  itemTitle: { ...font.body, color: colors.text },
  itemMeta: { ...font.caption, color: colors.textFaint, marginTop: 2 },
  struck: { color: colors.textFaint, textDecorationLine: "line-through" },
  snooze: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  snoozeText: { ...font.caption, color: colors.textMuted },
  emptyLine: { paddingVertical: spacing.lg, paddingHorizontal: spacing.sm },
  emptyText: { ...font.body, color: colors.textFaint },
});
