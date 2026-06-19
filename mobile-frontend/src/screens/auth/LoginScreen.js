import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import LinearGradient from "react-native-linear-gradient";
import * as Animatable from "react-native-animatable";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Logo } from "../../components/brand/Logo";

const LoginScreen = () => {
  const navigation = useNavigation();
  const { login } = useAuth();
  const { theme } = useTheme();
  const styles = makeStyles(theme);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await login(email, password);
      // RootNavigator switches to the app automatically once authenticated.
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            style={styles.back}
            onPress={() => navigation.navigate("Home")}
          >
            <Icon name="arrow-left" size={22} color={theme.textSecondary} />
          </TouchableOpacity>

          <Animatable.View
            animation="fadeInDown"
            duration={600}
            style={styles.brand}
          >
            <Logo size={56} />
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>
              Sign in to your QuantumAlpha terminal
            </Text>
          </Animatable.View>

          <Animatable.View
            animation="fadeInUp"
            duration={600}
            delay={150}
            style={styles.form}
          >
            {error ? (
              <View style={styles.errorBox}>
                <Icon
                  name="alert-circle-outline"
                  size={16}
                  color={theme.error}
                />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Text style={styles.label}>Email</Text>
            <View style={styles.inputRow}>
              <Icon
                name="email-outline"
                size={19}
                color={theme.textSecondary}
              />
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor={theme.textMuted}
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  setError("");
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <Text style={styles.label}>Password</Text>
            <View style={styles.inputRow}>
              <Icon name="lock-outline" size={19} color={theme.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={theme.textMuted}
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  setError("");
                }}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword((s) => !s)}>
                <Icon
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={19}
                  color={theme.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.forgot}
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleLogin}
              disabled={loading}
            >
              <LinearGradient
                colors={theme.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                {loading ? (
                  <ActivityIndicator color="#060A14" />
                ) : (
                  <Text style={styles.buttonText}>Sign in</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>New to QuantumAlpha? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={styles.footerLink}>Create an account</Text>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const makeStyles = (theme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    scroll: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 30 },
    back: { paddingVertical: 12, width: 40 },
    brand: { alignItems: "center", marginTop: 12, marginBottom: 32 },
    title: {
      color: theme.text,
      fontSize: 28,
      fontWeight: "800",
      marginTop: 18,
      letterSpacing: -0.5,
    },
    subtitle: { color: theme.textSecondary, fontSize: 14.5, marginTop: 6 },
    form: {},
    label: {
      color: theme.textSecondary,
      fontSize: 13,
      fontWeight: "600",
      marginBottom: 8,
      marginTop: 16,
    },
    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.card,
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 14,
      height: 52,
    },
    input: { flex: 1, color: theme.text, fontSize: 15.5, marginLeft: 10 },
    forgot: { alignSelf: "flex-end", marginTop: 14 },
    forgotText: { color: theme.primary, fontWeight: "600", fontSize: 13.5 },
    button: {
      height: 54,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 24,
    },
    buttonText: { color: "#060A14", fontWeight: "800", fontSize: 16.5 },
    footerRow: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 26,
    },
    footerText: { color: theme.textSecondary, fontSize: 14 },
    footerLink: { color: theme.primary, fontSize: 14, fontWeight: "700" },
    errorBox: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: "rgba(251,113,133,0.1)",
      borderColor: "rgba(251,113,133,0.3)",
      borderWidth: 1,
      borderRadius: 10,
      padding: 12,
      marginBottom: 4,
    },
    errorText: { color: theme.error, fontSize: 13.5, marginLeft: 8, flex: 1 },
  });

export default LoginScreen;
