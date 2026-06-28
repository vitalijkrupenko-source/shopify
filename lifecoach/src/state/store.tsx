import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type {
  AppData,
  ChatMessage,
  Habit,
  IdentityStatement,
  Aim,
  Pattern,
  Settings,
  Task,
} from "./types";

const STORAGE_KEY = "lifecoach.appdata.v1";

export const DEFAULT_SETTINGS: Settings = {
  tone: "calm",
  guidance: "socratic",
  slipResponse: "curious",
  challenge: "medium",
  morningCheckIn: true,
  eveningCheckIn: true,
  weeklyReview: true,
  voiceReplies: true,
  activeDomains: [
    "identity",
    "career",
    "health",
    "relationships",
    "mind",
    "money",
  ],
};

const EMPTY: AppData = {
  onboarded: false,
  settings: DEFAULT_SETTINGS,
  identityStatements: [],
  aims: [],
  habits: [],
  tasks: [],
  patterns: [],
  conversation: [],
};

// ── id helper (no Math.random dependency on first paint determinism needed) ──
let counter = 0;
export const newId = (): string =>
  `${Date.now().toString(36)}-${(counter++).toString(36)}`;

export const todayISO = (): string => new Date().toISOString().slice(0, 10);

// ── reducer ────────────────────────────────────────────────────────────────
type Action =
  | { type: "HYDRATE"; data: AppData }
  | { type: "PATCH"; patch: Partial<AppData> }
  | { type: "ADD_MESSAGE"; message: ChatMessage }
  | { type: "UPDATE_MESSAGE"; id: string; patch: Partial<ChatMessage> }
  | { type: "ADD_IDENTITY"; statement: IdentityStatement }
  | { type: "ADD_AIM"; aim: Aim }
  | { type: "UPDATE_AIM"; id: string; patch: Partial<Aim> }
  | { type: "REMOVE_AIM"; id: string }
  | { type: "ADD_HABIT"; habit: Habit }
  | { type: "UPDATE_HABIT"; id: string; patch: Partial<Habit> }
  | { type: "TOGGLE_HABIT_TODAY"; id: string }
  | { type: "ADD_TASK"; task: Task }
  | { type: "UPDATE_TASK"; id: string; patch: Partial<Task> }
  | { type: "ADD_PATTERN"; pattern: Pattern }
  | { type: "UPDATE_SETTINGS"; patch: Partial<Settings> }
  | { type: "RESET" };

function reducer(state: AppData, action: Action): AppData {
  switch (action.type) {
    case "HYDRATE":
      return action.data;
    case "PATCH":
      return { ...state, ...action.patch };
    case "ADD_MESSAGE":
      return { ...state, conversation: [...state.conversation, action.message] };
    case "UPDATE_MESSAGE":
      return {
        ...state,
        conversation: state.conversation.map((m) =>
          m.id === action.id ? { ...m, ...action.patch } : m
        ),
      };
    case "ADD_IDENTITY":
      return {
        ...state,
        identityStatements: [...state.identityStatements, action.statement],
      };
    case "ADD_AIM":
      return { ...state, aims: [...state.aims, action.aim] };
    case "UPDATE_AIM":
      return {
        ...state,
        aims: state.aims.map((a) =>
          a.id === action.id ? { ...a, ...action.patch } : a
        ),
      };
    case "REMOVE_AIM":
      return { ...state, aims: state.aims.filter((a) => a.id !== action.id) };
    case "ADD_HABIT":
      return { ...state, habits: [...state.habits, action.habit] };
    case "UPDATE_HABIT":
      return {
        ...state,
        habits: state.habits.map((h) =>
          h.id === action.id ? { ...h, ...action.patch } : h
        ),
      };
    case "TOGGLE_HABIT_TODAY": {
      const day = todayISO();
      return {
        ...state,
        habits: state.habits.map((h) => {
          if (h.id !== action.id) return h;
          const done = h.completedDates.includes(day);
          const completedDates = done
            ? h.completedDates.filter((d) => d !== day)
            : [...h.completedDates, day];
          return {
            ...h,
            completedDates,
            streak: computeStreak(completedDates),
          };
        }),
      };
    }
    case "ADD_TASK":
      return { ...state, tasks: [...state.tasks, action.task] };
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.id ? { ...t, ...action.patch } : t
        ),
      };
    case "ADD_PATTERN":
      return { ...state, patterns: [...state.patterns, action.pattern] };
    case "UPDATE_SETTINGS":
      return { ...state, settings: { ...state.settings, ...action.patch } };
    case "RESET":
      return { ...EMPTY, settings: DEFAULT_SETTINGS };
    default:
      return state;
  }
}

/** Counts consecutive days ending today (or yesterday) the habit was done. */
export function computeStreak(completedDates: string[]): number {
  const set = new Set(completedDates);
  let streak = 0;
  const cursor = new Date();
  // Allow the streak to "hold" if today isn't logged yet but yesterday was.
  if (!set.has(cursor.toISOString().slice(0, 10))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!set.has(cursor.toISOString().slice(0, 10))) return 0;
  }
  while (set.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

// ── context ──────────────────────────────────────────────────────────────
interface StoreValue {
  data: AppData;
  ready: boolean;
  dispatch: React.Dispatch<Action>;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [data, dispatch] = useReducer(reducer, EMPTY);
  const readyRef = useRef(false);
  const [ready, setReady] = React.useState(false);

  // Hydrate once on mount.
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as AppData;
          dispatch({
            type: "HYDRATE",
            data: { ...EMPTY, ...parsed, settings: { ...DEFAULT_SETTINGS, ...parsed.settings } },
          });
        }
      } catch {
        // Corrupt store — fall back to empty rather than crash.
      } finally {
        readyRef.current = true;
        setReady(true);
      }
    })();
  }, []);

  // Persist on every change after hydration.
  useEffect(() => {
    if (!readyRef.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)).catch(() => {});
  }, [data]);

  const value = useMemo(() => ({ data, ready, dispatch }), [data, ready]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

/** Convenience selector hook. */
export function useData(): AppData {
  return useStore().data;
}

/** Common action creators bound to dispatch. */
export function useActions() {
  const { dispatch } = useStore();

  const addMessage = useCallback(
    (m: Omit<ChatMessage, "id" | "createdAt">) => {
      const message: ChatMessage = { ...m, id: newId(), createdAt: Date.now() };
      dispatch({ type: "ADD_MESSAGE", message });
      return message.id;
    },
    [dispatch]
  );

  return useMemo(
    () => ({
      dispatch,
      addMessage,
      updateMessage: (id: string, patch: Partial<ChatMessage>) =>
        dispatch({ type: "UPDATE_MESSAGE", id, patch }),
      patch: (patch: Partial<AppData>) => dispatch({ type: "PATCH", patch }),
      updateSettings: (patch: Partial<Settings>) =>
        dispatch({ type: "UPDATE_SETTINGS", patch }),
    }),
    [dispatch, addMessage]
  );
}
