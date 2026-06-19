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

const isEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

const RegisterScreen = () => {
  const navigation = useNavigation();
  const { register } = useAuth();
  const { theme } = useTheme();
  const styles = makeStyles(theme);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (key) => (value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setError("");
  };

  const handleRegister = async () => {
    if (!form.name.trim()) return setError("Please enter your name");
    if (!isEmail(form.email)) return setError("Enter a valid email address");
    if (form.password.length < 8)
      return setError("Password must be at least 8 characters");
    if (form.password !== form.confirm)
      return setError("Passwords do not match");

    try {
      setLoading(true);
      setError("");
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      // RootNavigator switches to the app once authenticated.
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const field = (key, label, icon, opts = {}) => (
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <Icon name={icon} size={19} color={theme.textSecondary} />
        <TextInput
          style={styles.input}
          placeholderTextColor={theme.textMuted}
          value={form[key]}
          onChangeText={set(key)}
          {...opts}
        />
        {opts.secureToggle && (
          <TouchableOpacity onPress={() => setShowPassword((s) => !s)}>
            <Icon
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={19}
              color={theme.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
    </>
  );

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
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={22} color={theme.textSecondary} />
          </TouchableOpacity>

          <Animatable.View
            animation="fadeInDown"
            duration={600}
            style={styles.brand}
          >
            <Logo size={52} />
            <Text style={styles.title}>Create your account</Text>
            <Text style={styles.subtitle}>
              Set up your terminal in two minutes
            </Text>
          </Animatable.View>

          <Animatable.View animation="fadeInUp" duration={600} delay={150}>
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

            {field("name", "Full name", "account-outline", {
              placeholder: "Ada Lovelace",
              autoCapitalize: "words",
            })}
            {field("email", "Email", "email-outline", {
              placeholder: "you@example.com",
              keyboardType: "email-address",
              autoCapitalize: "none",
              autoCorrect: false,
            })}
            {field("password", "Password", "lock-outline", {
              placeholder: "At least 8 characters",
              secureTextEntry: !showPassword,
              secureToggle: true,
            })}
            {field("confirm", "Confirm password", "lock-check-outline", {
              placeholder: "Re-enter password",
              secureTextEntry: !showPassword,
            })}

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleRegister}
              disabled={loading}
              style={{ marginTop: 24 }}
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
                  <Text style={styles.buttonText}>Create account</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.footerLink}>Sign in</Text>
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
    brand: { alignItems: "center", marginTop: 8, marginBottom: 24 },
    title: {
      color: theme.text,
      fontSize: 26,
      fontWeight: "800",
      marginTop: 16,
      letterSpacing: -0.5,
    },
    subtitle: { color: theme.textSecondary, fontSize: 14.5, marginTop: 6 },
    label: {
      color: theme.textSecondary,
      fontSize: 13,
      fontWeight: "600",
      marginBottom: 8,
      marginTop: 14,
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
    button: {
      height: 54,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: { color: "#060A14", fontWeight: "800", fontSize: 16.5 },
    footerRow: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 24,
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
    },
    errorText: { color: theme.error, fontSize: 13.5, marginLeft: 8, flex: 1 },
  });

export default RegisterScreen;
