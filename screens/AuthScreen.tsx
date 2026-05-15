import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import Toast from "react-native-toast-message";

import { getCurrentUser, signIn, signOut, signUp } from "../api/routes/auth";
import { getUserVisibleHttpMessage } from "../lib/api/normalizedHttpError";
import {
  authCredentialSchema,
  type AuthCredentialValues,
} from "../schemas/authForms";

type AuthMode = "signIn" | "signUp";

const AuthScreen = () => {
  const [mode, setMode] = useState<AuthMode>("signIn");
  const [signedInEmail, setSignedInEmail] = useState<string | null>(null);

  const defaultValues = useMemo(
    () => ({ email: "", password: "" } satisfies AuthCredentialValues),
    []
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthCredentialValues>({
    resolver: zodResolver(authCredentialSchema),
    defaultValues,
    mode: "onSubmit",
  });

  const fieldSummary = useMemo(() => {
    const parts: string[] = [];
    if (errors.email?.message) parts.push(errors.email.message);
    if (errors.password?.message) parts.push(errors.password.message);
    return parts.join(" ");
  }, [errors.email?.message, errors.password?.message]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      if (mode === "signIn") {
        const res = await signIn(values.email.trim(), values.password);
        const email =
          (res.data as { email?: string } | undefined)?.email ??
          values.email.trim();
        setSignedInEmail(email);
        Toast.show({ type: "success", text1: "Signed in" });
      } else {
        await signUp(values.email.trim(), values.password);
        setSignedInEmail(values.email.trim());
        Toast.show({ type: "success", text1: "Account created", text2: "You can sign in." });
      }
    } catch (err) {
      const msg = getUserVisibleHttpMessage(err);
      Toast.show({
        type: "error",
        text1: mode === "signIn" ? "Sign-in failed" : "Sign-up failed",
        text2: msg,
      });
    }
  });

  const runSignOut = async () => {
    try {
      await signOut();
      setSignedInEmail(null);
      Toast.show({ type: "success", text1: "Signed out" });
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Sign-out failed",
        text2: getUserVisibleHttpMessage(err),
      });
    }
  };

  const refreshCurrentUser = async () => {
    try {
      const res = await getCurrentUser();
      const u = (res.data as { currentUser?: { email?: string } })?.currentUser;
      Toast.show({
        type: "info",
        text1: "Current session",
        text2: u?.email ?? JSON.stringify(res.data).slice(0, 120),
      });
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Could not load session",
        text2: getUserVisibleHttpMessage(err),
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Cream Paws</Text>
        <Text style={styles.subtitle}>
          {signedInEmail ? `Signed in as ${signedInEmail}` : "Driver sign-in"}
        </Text>

        <View style={styles.segment}>
          <Pressable
            accessibilityRole="button"
            style={[styles.segmentBtn, mode === "signIn" && styles.segmentBtnActive]}
            onPress={() => setMode("signIn")}
          >
            <Text style={[styles.segmentLabel, mode === "signIn" && styles.segmentLabelActive]}>
              Sign in
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            style={[styles.segmentBtn, mode === "signUp" && styles.segmentBtnActive]}
            onPress={() => setMode("signUp")}
          >
            <Text style={[styles.segmentLabel, mode === "signUp" && styles.segmentLabelActive]}>
              Sign up
            </Text>
          </Pressable>
        </View>

        {fieldSummary ? (
          <View style={styles.summaryBox} accessibilityLiveRegion="polite">
            <Text style={styles.summaryTitle}>Check your details</Text>
            <Text style={styles.summaryBody}>{fieldSummary}</Text>
          </View>
        ) : null}

        <Text style={styles.label}>Email *</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              testID="auth-email-input"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="username"
              returnKeyType="next"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="you@example.com"
              placeholderTextColor="#888"
              style={styles.input}
            />
          )}
        />

        <Text style={styles.label}>Password *</Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              testID="auth-password-input"
              secureTextEntry
              textContentType={mode === "signIn" ? "password" : "newPassword"}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="At least 8 characters"
              placeholderTextColor="#888"
              style={styles.input}
            />
          )}
        />

        <Pressable
          testID="auth-submit-primary"
          accessibilityRole="button"
          style={({ pressed }) => [styles.primaryBtn, pressed && styles.primaryBtnPressed]}
          onPress={() => void onSubmit()}
        >
          <Text style={styles.primaryBtnText}>
            {mode === "signIn" ? "Sign in" : "Create account"}
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          style={styles.secondaryBtn}
          onPress={() => void runSignOut()}
        >
          <Text style={styles.secondaryBtnText}>Sign out</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          style={styles.tertiaryBtn}
          onPress={() => void refreshCurrentUser()}
        >
          <Text style={styles.tertiaryBtnText}>Show current session</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#1e1e1e" },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
    maxWidth: 480,
    width: "100%",
    alignSelf: "center",
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 6,
  },
  subtitle: {
    color: "#c8c8c8",
    fontSize: 16,
    marginBottom: 20,
  },
  segment: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 4,
  },
  segmentBtn: {
    flex: 1,
    minHeight: 48,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentBtnActive: {
    backgroundColor: "rgba(255,94,94, 0.95)",
  },
  segmentLabel: {
    color: "#aaa",
    fontSize: 16,
    fontWeight: "600",
  },
  segmentLabelActive: {
    color: "#fff",
  },
  summaryBox: {
    backgroundColor: "#3a2a2a",
    borderLeftWidth: 4,
    borderLeftColor: "rgba(255,94,94, 1)",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  summaryTitle: {
    color: "#ffb4b4",
    fontWeight: "700",
    marginBottom: 4,
    fontSize: 15,
  },
  summaryBody: {
    color: "#fde8e8",
    fontSize: 15,
    lineHeight: 22,
  },
  label: {
    color: "#e0e0e0",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    minHeight: 52,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#444",
    paddingHorizontal: 14,
    fontSize: 18,
    color: "#fff",
    backgroundColor: "#2a2a2a",
    marginBottom: 16,
  },
  primaryBtn: {
    minHeight: 54,
    borderRadius: 12,
    backgroundColor: "rgba(255,94,94, 1)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  primaryBtnPressed: {
    opacity: 0.88,
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  secondaryBtn: {
    minHeight: 48,
    marginTop: 14,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#555",
  },
  secondaryBtnText: {
    color: "#ddd",
    fontSize: 16,
    fontWeight: "600",
  },
  tertiaryBtn: {
    marginTop: 16,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  tertiaryBtnText: {
    color: "#88b4ff",
    fontSize: 15,
  },
});

export default AuthScreen;
