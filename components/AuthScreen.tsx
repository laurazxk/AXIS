import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useAxisTheme } from "../contexts/ThemeContext";
import { useAxisAuth } from "../contexts/AuthContext";

export default function AuthScreen({
  variant,
}: {
  variant: "login" | "register";
}) {
  const { palette, darkMode } = useAxisTheme();
  const { register, login, loginWithGoogle } = useAxisAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);

  const creating = variant === "register";

  const submit = async () => {
    if (
      creating &&
      (!firstName.trim() || !lastName.trim())
    ) {
      return Alert.alert(
        "Campos obrigatórios",
        "Informe seu nome e sobrenome."
      );
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      return Alert.alert(
        "E-mail inválido",
        "Confira o endereço de e-mail."
      );
    }

    if (password.length < 8) {
      return Alert.alert(
        "Senha inválida",
        "Use pelo menos 8 caracteres."
      );
    }

    if (creating && password !== confirm) {
      return Alert.alert(
        "Senhas diferentes",
        "As senhas precisam ser iguais."
      );
    }

    setBusy(true);

    try {
      if (creating) {
        await register({
          firstName,
          lastName,
          email,
          password,
        });
      } else {
        await login({ email, password });
      }

      router.replace("/logic/home");
    } catch (error) {
      Alert.alert(
        "Não foi possível entrar",
        error instanceof Error
          ? error.message
          : "Tente novamente."
      );
    } finally {
      setBusy(false);
    }
  };

  
const social = async (provider: string) => {
  if (provider === "Google") {
    try {
      await loginWithGoogle();
      router.replace("/logic/home");
    } catch (error: any) {
      console.error("Erro no login Google:", error);

      Alert.alert(
        "Erro ao entrar com Google",
        error.message || "Não foi possível realizar o login."
      );
    }
  }
};

  const input = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    options: {
      secure?: boolean;
      email?: boolean;
    } = {}
  ) => (
    <View style={{ gap: 7 }}>
      <Text
        style={{
          color: palette.text,
          fontWeight: "600",
          fontSize: 13,
        }}
      >
        {label}
      </Text>

      <View
        style={[
          styles.inputWrap,
          {
            backgroundColor: palette.surfaceStrong,
            borderColor: palette.border,
          },
        ]}
      >
        <TextInput
          placeholder={label}
          placeholderTextColor={palette.inputPlaceholder}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize={
            options.email
              ? "none"
              : options.secure
              ? "none"
              : "words"
          }
          autoCorrect={false}
          keyboardType={
            options.email
              ? "email-address"
              : "default"
          }
          secureTextEntry={
            options.secure && !visible
          }
          style={[
            styles.input,
            { color: palette.text },
          ]}
        />

        {options.secure && (
          <Pressable
            accessibilityLabel={
              visible
                ? "Ocultar senha"
                : "Mostrar senha"
            }
            onPress={() => setVisible(!visible)}
          >
            <MaterialIcons
              name={
                visible
                  ? "visibility-off"
                  : "visibility"
              }
              color={palette.muted}
              size={20}
            />
          </Pressable>
        )}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: palette.background,
      }}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <StatusBar
        barStyle={
          darkMode
            ? "light-content"
            : "dark-content"
        }
      />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.page}
      >
        <View style={styles.brand}>
          <View
            style={[
              styles.logo,
              {
                backgroundColor: palette.accent,
              },
            ]}
          >
            <MaterialIcons
              name="flight-takeoff"
              size={28}
              color={palette.accentText}
            />
          </View>

          <Text
            style={[
              styles.brandName,
              { color: palette.text },
            ]}
          >
            AXIS
          </Text>
        </View>

        <Text
          style={[
            styles.heading,
            { color: palette.text },
          ]}
        >
          {creating
            ? "Crie sua conta"
            : "Bem-vindo de volta"}
        </Text>

        <Text
          style={[
            styles.subheading,
            { color: palette.muted },
          ]}
        >
          {creating
            ? "Comece a planejar suas próximas viagens."
            : "Entre para continuar suas viagens."}
        </Text>

        <View style={styles.fields}>
          {creating && (
            <View style={styles.nameRow}>
              <View style={{ flex: 1 }}>
                {input(
                  "Nome",
                  firstName,
                  setFirstName
                )}
              </View>

              <View style={{ flex: 1 }}>
                {input(
                  "Sobrenome",
                  lastName,
                  setLastName
                )}
              </View>
            </View>
          )}

          {input("E-mail", email, setEmail, {
            email: true,
          })}

          {input(
            "Senha",
            password,
            setPassword,
            { secure: true }
          )}

          {creating &&
            input(
              "Confirmar senha",
              confirm,
              setConfirm,
              { secure: true }
            )}
        </View>

        <Pressable
          onPress={submit}
          disabled={busy}
          style={[
            styles.primary,
            {
              backgroundColor: palette.accent,
            },
          ]}
        >
          {busy ? (
            <ActivityIndicator
              color={palette.accentText}
            />
          ) : (
            <Text
              style={[
                styles.primaryText,
                {
                  color: palette.accentText,
                },
              ]}
            >
              {creating
                ? "Criar conta"
                : "Entrar"}
            </Text>
          )}
        </Pressable>

        <View style={styles.separator}>
          <View
            style={[
              styles.line,
              {
                backgroundColor:
                  palette.divider,
              },
            ]}
          />

          <Text
            style={{ color: palette.muted }}
          >
            ou continue com
          </Text>

          <View
            style={[
              styles.line,
              {
                backgroundColor:
                  palette.divider,
              },
            ]}
          />
        </View>

        <View style={styles.socialRow}>
          
          <Pressable
            onPress={() => social("Google")}
            style={[
              styles.social,
              {
                borderColor: palette.border,
                backgroundColor:
                  palette.surfaceStrong,
              },
            ]}
          >
            <Text
              style={{
                color: palette.text,
                fontSize: 21,
                fontWeight: "800",
              }}
            >
              G
            </Text>

            <Text
              style={{
                color: palette.text,
                fontWeight: "600",
              }}
            >
              Google
            </Text>
          </Pressable>
        </View>

        <Pressable
          onPress={() =>
            router.replace(
              creating
                ? "/public/login"
                : "/public/register"
            )
          }
          style={styles.switch}
        >
          <Text
            style={{ color: palette.muted }}
          >
            {creating
              ? "Já tem uma conta? "
              : "Ainda não tem uma conta? "}

            <Text
              style={{
                color: palette.text,
                fontWeight: "800",
              }}
            >
              {creating
                ? "Entrar"
                : "Cadastre-se"}
            </Text>
          </Text>
        </Pressable>

        <Text
          style={[
            styles.disclaimer,
            { color: palette.muted },
          ]}
        >
          Versão de demonstração: os dados
          ainda não são salvos em servidor.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 26,
    paddingVertical: 48,
    maxWidth: 540,
    width: "100%",
    alignSelf: "center",
  },
  brand: {
    alignItems: "center",
    marginBottom: 36,
    gap: 10,
  },
  logo: {
    width: 58,
    height: 58,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  brandName: {
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 5,
  },
  heading: {
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 8,
  },
  subheading: {
    fontSize: 15,
    marginBottom: 28,
  },
  fields: {
    gap: 17,
  },
  nameRow: {
    flexDirection: "row",
    gap: 12,
  },
  inputWrap: {
    minHeight: 54,
    borderRadius: 15,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 12,
  },
  primary: {
    marginTop: 26,
    borderRadius: 16,
    minHeight: 55,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryText: {
    fontSize: 16,
    fontWeight: "800",
  },
  separator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 24,
  },
  line: {
    height: 1,
    flex: 1,
  },
  socialRow: {
    flexDirection: "row",
    gap: 12,
  },
  social: {
    flex: 1,
    minHeight: 54,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 9,
  },
  switch: {
    marginTop: 28,
    alignItems: "center",
    padding: 8,
  },
  disclaimer: {
    marginTop: 28,
    textAlign: "center",
    fontSize: 11,
  },
});