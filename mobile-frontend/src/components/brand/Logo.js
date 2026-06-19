import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, {
  Path,
  Circle,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";
import { useTheme } from "../../context/ThemeContext";

/**
 * QuantumAlpha logomark - a hexagonal lattice node, matching the web logo.
 */
export const Logo = ({ size = 36 }) => {
  const { theme } = useTheme();
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Defs>
        <LinearGradient id="qaBrand" x1="0" y1="0" x2="48" y2="48">
          <Stop offset="0" stopColor={theme.primary} />
          <Stop offset="1" stopColor={theme.secondary} />
        </LinearGradient>
      </Defs>
      <Path
        d="M24 3 41.2 13v22L24 45 6.8 35V13L24 3Z"
        stroke="url(#qaBrand)"
        strokeWidth={2.4}
        fill="rgba(34,211,238,0.06)"
      />
      <Circle cx={24} cy={24} r={3.4} fill="url(#qaBrand)" />
      <Path
        d="M24 24 L33 33"
        stroke="url(#qaBrand)"
        strokeWidth={2.4}
        strokeLinecap="round"
      />
      <Circle cx={24} cy={11} r={1.7} fill={theme.primary} />
      <Circle cx={36} cy={30} r={1.7} fill={theme.secondary} />
      <Circle cx={12} cy={30} r={1.7} fill={theme.primary} />
    </Svg>
  );
};

export const Wordmark = ({ size = 34, color }) => {
  const { theme } = useTheme();
  return (
    <View style={styles.row}>
      <Logo size={size} />
      <Text
        style={[
          styles.text,
          { fontSize: size * 0.55, color: color || theme.text },
        ]}
      >
        QuantumAlpha
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
  text: { fontWeight: "800", marginLeft: 10, letterSpacing: -0.5 },
});

export default Logo;
