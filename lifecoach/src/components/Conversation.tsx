import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { colors, font, radius, spacing } from "../theme";
import { useData } from "../state/store";
import { useCoach } from "../coach/useCoach";
import { useVoiceInput } from "../voice/useVoiceInput";
import type { ChatMessage } from "../state/types";

interface Props {
  accent?: string;
  onboarding?: boolean;
  /** Optional message shown when the conversation is empty. */
  emptyHint?: string;
}

export function Conversation({ accent = colors.amber, onboarding, emptyHint }: Props) {
  const data = useData();
  const { send, thinking } = useCoach();
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<ScrollView>(null);

  // Final transcript → send it as a spoken turn.
  const onFinalSpeech = useCallback(
    (text: string) => {
      setDraft("");
      send(text, { via: "voice", onboarding });
    },
    [send, onboarding]
  );
  const voice = useVoiceInput(onFinalSpeech);

  useEffect(() => {
    const t = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 60);
    return () => clearTimeout(t);
  }, [data.conversation.length, thinking, voice.partial]);

  useEffect(() => {
    if (voice.error) Alert.alert("Voice", voice.error);
  }, [voice.error]);

  const submit = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    send(text, { via: "text", onboarding });
  };

  const onMic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!voice.available) {
      // Expo Go: no native STT. Replies are still spoken; explain the path.
      Alert.alert(
        "Talking out loud",
        "Live speech-to-text needs a native dev build (iOS Speech framework). In Expo Go you can type, and the coach speaks its replies back. Build a dev client to talk out loud — see the README.",
        [{ text: "Got it" }]
      );
      return;
    }
    if (voice.recording) voice.stop();
    else void voice.start();
  };

  // While listening, surface the live transcript in the field.
  const fieldValue = voice.recording ? voice.partial : draft;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
    >
      <ScrollView
        ref={scrollRef}
        style={styles.flex}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {data.conversation.length === 0 && emptyHint ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>{emptyHint}</Text>
          </View>
        ) : null}

        {data.conversation.map((m) => (
          <Bubble key={m.id} message={m} accent={accent} />
        ))}

        {thinking ? <TypingDots accent={accent} /> : null}
      </ScrollView>

      <View style={styles.composer}>
        <Pressable
          onPress={onMic}
          style={[styles.mic, voice.recording ? { backgroundColor: colors.danger, borderColor: colors.danger } : null]}
        >
          <Ionicons
            name={voice.recording ? "stop" : "mic-outline"}
            size={22}
            color={voice.recording ? colors.onAccent : colors.textMuted}
          />
        </Pressable>
        <TextInput
          value={fieldValue}
          onChangeText={setDraft}
          editable={!voice.recording}
          placeholder={
            voice.recording
              ? "Listening…"
              : onboarding
              ? "Tell the coach…"
              : "Talk to your coach…"
          }
          placeholderTextColor={colors.textFaint}
          style={styles.input}
          multiline
          onSubmitEditing={submit}
          blurOnSubmit
          returnKeyType="send"
        />
        <Pressable
          onPress={submit}
          disabled={!draft.trim() || voice.recording}
          style={[
            styles.sendBtn,
            { backgroundColor: draft.trim() && !voice.recording ? accent : colors.surfaceStrong },
          ]}
        >
          <Ionicons
            name="arrow-up"
            size={22}
            color={draft.trim() && !voice.recording ? colors.onAccent : colors.textFaint}
          />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

function Bubble({ message, accent }: { message: ChatMessage; accent: string }) {
  const isUser = message.role === "user";
  return (
    <View style={[styles.row, isUser ? styles.rowEnd : styles.rowStart]}>
      {!isUser ? (
        <View style={[styles.avatar, { borderColor: accent }]}>
          <Ionicons name="sparkles" size={13} color={accent} />
        </View>
      ) : null}
      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.coachBubble,
          isUser ? null : { borderColor: colors.border },
        ]}
      >
        <Text style={[styles.bubbleText, isUser ? styles.userText : null]}>{message.text}</Text>
      </View>
    </View>
  );
}

function TypingDots({ accent }: { accent: string }) {
  return (
    <View style={[styles.row, styles.rowStart]}>
      <View style={[styles.avatar, { borderColor: accent }]}>
        <Ionicons name="sparkles" size={13} color={accent} />
      </View>
      <View style={[styles.bubble, styles.coachBubble]}>
        <Text style={styles.typing}>thinking…</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl, gap: spacing.md },
  empty: { paddingVertical: spacing.xxl, paddingHorizontal: spacing.sm },
  emptyText: { ...font.body, color: colors.textMuted, textAlign: "center" },
  row: { flexDirection: "row", alignItems: "flex-end", gap: spacing.sm, maxWidth: "100%" },
  rowStart: { justifyContent: "flex-start" },
  rowEnd: { justifyContent: "flex-end" },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  bubble: {
    maxWidth: "82%",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
  },
  coachBubble: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomLeftRadius: 6,
  },
  userBubble: {
    backgroundColor: colors.surfaceStrong,
    borderBottomRightRadius: 6,
  },
  bubbleText: { ...font.body, color: colors.text },
  userText: { color: colors.text },
  typing: { ...font.body, color: colors.textFaint, fontStyle: "italic" },
  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.bgElevated,
  },
  mic: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    color: colors.text,
    ...font.body,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
});
