import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Speech-to-text via expo-speech-recognition (iOS Speech framework / Android
 * SpeechRecognizer). The native module only exists in a dev/standalone build —
 * in Expo Go it isn't linked, so we guard the require: a missing module leaves
 * `available` false and the UI falls back to typed input. This keeps the rest
 * of the app working in Expo Go while real voice works in a dev build.
 */

// Metro provides a CommonJS `require` at runtime; declare it for the type-checker.
declare const require: (name: string) => any;

let SpeechModule: any = null;
try {
  // Loading the package runs requireNativeModule(), which throws when the
  // native side is absent (Expo Go) — caught here so import never crashes.
  SpeechModule = require("expo-speech-recognition").ExpoSpeechRecognitionModule;
  if (SpeechModule && typeof SpeechModule.start !== "function") {
    SpeechModule = null;
  }
} catch {
  SpeechModule = null;
}

export function isVoiceAvailable(): boolean {
  return SpeechModule != null;
}

interface VoiceState {
  available: boolean;
  recording: boolean;
  partial: string;
  error: string | null;
  start: () => Promise<void>;
  stop: () => void;
}

interface ResultEvent {
  isFinal: boolean;
  results?: { transcript: string }[];
}

/**
 * @param onFinal called with the final transcript when a turn of speech ends.
 */
export function useVoiceInput(onFinal: (text: string) => void): VoiceState {
  const [recording, setRecording] = useState(false);
  const [partial, setPartial] = useState("");
  const [error, setError] = useState<string | null>(null);
  const partialRef = useRef("");
  const onFinalRef = useRef(onFinal);
  onFinalRef.current = onFinal;

  useEffect(() => {
    if (!SpeechModule) return;
    const subs = [
      SpeechModule.addListener("result", (e: ResultEvent) => {
        const t = e.results?.[0]?.transcript ?? "";
        partialRef.current = t;
        setPartial(t);
      }),
      SpeechModule.addListener("end", () => {
        const t = partialRef.current.trim();
        partialRef.current = "";
        setPartial("");
        setRecording(false);
        if (t) onFinalRef.current(t);
      }),
      SpeechModule.addListener("error", (e: { error?: string; message?: string }) => {
        partialRef.current = "";
        setPartial("");
        setRecording(false);
        // "no-speech" / "aborted" are routine; only surface real failures.
        if (e?.error && e.error !== "no-speech" && e.error !== "aborted") {
          setError(e.message || e.error);
        }
      }),
    ];
    return () => subs.forEach((s) => s?.remove?.());
  }, []);

  const start = useCallback(async () => {
    if (!SpeechModule) return;
    setError(null);
    try {
      const perm = await SpeechModule.requestPermissionsAsync();
      if (!perm?.granted) {
        setError("Microphone and speech access are needed to talk out loud.");
        return;
      }
      partialRef.current = "";
      setPartial("");
      setRecording(true);
      SpeechModule.start({
        lang: "en-US",
        interimResults: true,
        continuous: false,
        addsPunctuation: true,
      });
    } catch (e) {
      setRecording(false);
      setError((e as Error).message);
    }
  }, []);

  const stop = useCallback(() => {
    if (!SpeechModule) return;
    try {
      SpeechModule.stop();
    } catch {
      setRecording(false);
    }
  }, []);

  return { available: isVoiceAvailable(), recording, partial, error, start, stop };
}
