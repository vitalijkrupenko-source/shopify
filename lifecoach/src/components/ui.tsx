import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, font, radius, spacing } from "../theme";

export function Card({
  children,
  style,
  onPress,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}) {
  const Wrapper: any = onPress ? Pressable : View;
  return (
    <Wrapper
      onPress={onPress}
      style={({ pressed }: { pressed?: boolean }) => [
        styles.card,
        pressed && onPress ? { backgroundColor: colors.surfaceStrong } : null,
        style,
      ]}
    >
      {children}
    </Wrapper>
  );
}

export function SectionTitle({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionTitle}>{children}</Text>
      {hint ? <Text style={styles.sectionHint}>{hint}</Text> : null}
    </View>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <Text style={styles.eyebrow}>{String(children).toUpperCase()}</Text>;
}

export function Pill({
  label,
  active,
  onPress,
  tint = colors.amber,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
  tint?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.pill,
        active ? { backgroundColor: tint, borderColor: tint } : null,
      ]}
    >
      <Text style={[styles.pillText, active ? { color: colors.onAccent } : null]}>{label}</Text>
    </Pressable>
  );
}

export function PrimaryButton({
  label,
  onPress,
  loading,
  disabled,
  gradient,
}: {
  label: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  gradient?: string[];
}) {
  const content = loading ? (
    <ActivityIndicator color={gradient ? colors.onAccent : colors.onAccent} />
  ) : (
    <Text style={styles.primaryLabel}>{label}</Text>
  );
  if (gradient) {
    return (
      <Pressable onPress={disabled ? undefined : onPress} style={{ opacity: disabled ? 0.5 : 1 }}>
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.primary}
        >
          {content}
        </LinearGradient>
      </Pressable>
    );
  }
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={[styles.primary, styles.primarySolid, { opacity: disabled ? 0.5 : 1 }]}
    >
      {content}
    </Pressable>
  );
}

export function Tag({ text, tint = colors.textMuted }: { text: string; tint?: string }) {
  return (
    <View style={[styles.tag, { borderColor: tint }]}>
      <Text style={[styles.tagText, { color: tint }]}>{text}</Text>
    </View>
  );
}

/** Lightweight circular progress indicator built from a conic-ish stack. */
export function ProgressRing({
  progress,
  size = 56,
  color = colors.green,
  label,
}: {
  progress: number; // 0..1
  size?: number;
  color?: string;
  label?: string;
}) {
  const pct = Math.max(0, Math.min(1, progress));
  return (
    <View style={[styles.ring, { width: size, height: size, borderRadius: size / 2 }]}>
      <View
        style={[
          styles.ringFill,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: color,
            // crude arc: opacity scales with completion
            opacity: 0.25 + pct * 0.75,
          },
        ]}
      />
      <Text style={styles.ringLabel}>{label ?? `${Math.round(pct * 100)}%`}</Text>
    </View>
  );
}

export const text = StyleSheet.create({
  display: { ...font.display, color: colors.text },
  title: { ...font.title, color: colors.text },
  heading: { ...font.heading, color: colors.text },
  body: { ...font.body, color: colors.text },
  muted: { ...font.body, color: colors.textMuted },
  label: { ...font.label, color: colors.textMuted },
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  sectionTitle: { ...font.heading, color: colors.text },
  sectionHint: { ...font.caption, color: colors.textFaint },
  eyebrow: { ...font.caption, color: colors.textFaint, marginBottom: spacing.sm },
  pill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillText: { ...font.label, color: colors.text },
  primary: {
    height: 54,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  primarySolid: { backgroundColor: colors.text },
  primaryLabel: { ...font.heading, color: colors.onAccent },
  tag: {
    paddingHorizontal: spacing.md,
    paddingVertical: 3,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  tagText: { ...font.caption },
  ring: { alignItems: "center", justifyContent: "center" },
  ringFill: {
    position: "absolute",
    borderWidth: 4,
  },
  ringLabel: { ...font.caption, color: colors.text },
});
