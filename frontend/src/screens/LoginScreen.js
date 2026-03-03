import { View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, StatusBar, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {

  const { control, handleSubmit, formState: { errors }, reset } = useForm();
  const { loginUser, loading } = useContext(AuthContext);
  const [errorBackend, setErrorBackend] = useState(null);

  const handleLogin = async (data) => {
    try {
      await loginUser(data);
      navigation.navigate("Dashboard");
      setErrorBackend(null);
    } catch (error) {
      console.log(error);
      setErrorBackend(error.response?.data?.message || error.response?.data?.error);
      reset();
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#05080a" />

      <View style={styles.orb1} />
      <View style={styles.orb2} />

      {loading.login && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#3d9e60" />
            <Text style={styles.loadingText}>Iniciando sesión...</Text>
          </View>
        </View>
      )}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity style={styles.btnGoBack} onPress={() => navigation.goBack()}>
            <Text style={styles.btnGoBackText}>← Volver</Text>
          </TouchableOpacity>

          <View style={styles.headerSection}>
            <Text style={styles.title}>Iniciar sesión</Text>
            <Text style={styles.subtitle}>Ingresa tus datos para continuar</Text>
          </View>

          <View style={styles.card}>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Usuario o correo</Text>
              <Controller
                control={control}
                name="identifier"
                rules={{ required: "Este campo es obligatorio" }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[styles.input, errors.identifier && styles.inputError]}
                    placeholder="usuario@ejemplo.com"
                    placeholderTextColor="#3a4d3e"
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                )}
              />
              {errors.identifier && (
                <Text style={styles.errorText}>⚠ {errors.identifier.message}</Text>
              )}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Contraseña</Text>
              <Controller
                control={control}
                name="password"
                rules={{ required: "Este campo es obligatorio" }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[styles.input, errors.password && styles.inputError]}
                    placeholder="••••••••"
                    placeholderTextColor="#3a4d3e"
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry
                  />
                )}
              />
              {errors.password && (
                <Text style={styles.errorText}>⚠ {errors.password.message}</Text>
              )}
            </View>

            {errorBackend && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>⚠ {errorBackend}</Text>
              </View>
            )}

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(handleLogin)} activeOpacity={0.85}>
              <Text style={styles.submitButtonText}>Ingresar</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05080a",
  },
  orb1: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "#3d9e60",
    opacity: 0.06,
    bottom: -80,
    left: -100,
  },
  orb2: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#28e269",
    opacity: 0.04,
    top: 80,
    right: -130,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(5,8,10,0.85)",
    zIndex: 10,
  },
  loadingBox: {
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    color: "#5cba7d",
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  btnGoBack: {
    marginTop: 16,
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#3d9e60",
    backgroundColor: "#0f1f14",
  },
  btnGoBackText: {
    color: "#3d9e60",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  headerSection: {
    marginTop: height * 0.07,
    marginBottom: 32,
  },
  title: {
    color: "#e8f0ea",
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    color: "#4a6650",
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  card: {
    backgroundColor: "#0c1410",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#1a2b1e",
    shadowColor: "#07993a",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
    gap: 8,
  },
  fieldGroup: {
    marginBottom: 8,
  },
  fieldLabel: {
    color: "#5cba7d",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#111d14",
    color: "#e8f0ea",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    borderWidth: 1.5,
    borderColor: "#1a2b1e",
  },
  inputError: {
    borderColor: "#c0392b",
    backgroundColor: "#1a0c0c",
  },
  errorText: {
    color: "#e05a5a",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 6,
    letterSpacing: 0.2,
  },
  errorBanner: {
    backgroundColor: "#1a0c0c",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#c0392b44",
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 4,
  },
  errorBannerText: {
    color: "#e05a5a",
    fontSize: 13,
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#3d9e60",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#4db870",
    shadowColor: "#3d9e60",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
});

export default LoginScreen