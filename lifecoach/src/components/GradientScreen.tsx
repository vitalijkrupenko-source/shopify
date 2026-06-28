import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, Edge } from "react-native-safe-area-context";
import { auras, AuraName, colors } from "../theme";

interface Props {
  aura?: AuraName;
  children: React.ReactNode;
  edges?: Edge[];
  style?: ViewStyle;
}

/**
 * Full-bleed screen with the signature dark aura gradient from the reference
 * mockup — a colored glow at the top fading into near-black.
 */
export function GradientScreen({ aura = "dusk", children, edges = ["top"], style }: Props) {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={auras[aura] as unknown as string[]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView edges={edges} style={[styles.safe, style]}>
        {children}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  safe: { flex: 1 },
});
