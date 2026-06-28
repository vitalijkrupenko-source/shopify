import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";
import { useStore } from "../src/state/store";
import { colors } from "../src/theme";

/** Entry gate: route to discovery on first run, otherwise into the app. */
export default function Index() {
  const { data, ready } = useStore();

  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={colors.amber} />
      </View>
    );
  }

  return <Redirect href={data.onboarded ? "/(tabs)" : "/onboarding"} />;
}
