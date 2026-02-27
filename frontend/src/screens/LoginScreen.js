import { View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, StatusBar, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {

  const { control, handleSubmit, formState: { errors } } = useForm();

  const { loginUser, loading } = useContext(AuthContext);

  const [errorBackend, setErrorBackend] = useState(null);

  const handleLogin = async (data) => {
    try {
      await loginUser(data);
      setErrorBackend(null);
    } catch (error) {
      setErrorBackend(error.response?.data?.error);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#05080a" />

      <View style={styles.orb1} />
      <View style={styles.orb2} />

      {loading.login ? (
        <View style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)"
        }}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      ) :

        <View>
          <TouchableOpacity style={styles.btnGoBack} onPress={() => navigation.goBack()}>
            <Text style={styles.btnGoBackText}>← Volver</Text>
          </TouchableOpacity>

          <View style={styles.mainLogin}>
            <Text style={styles.title}>Iniciar sesión</Text>
            <Text style={styles.subtitle}>Ingresa tus datos para continuar</Text>
          </View>
        </View>}

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Nombre de usuario o correo</Text>
        <Controller
          control={control}
          name="identifier"
          rules={{ required: "Este campo es obligatorio" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.cardInput, errors.identifier && styles.cardInputError]}
              placeholder="usuario@ejemplo.com"
              placeholderTextColor="#c5c5c5"
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          )}
        />
        {errors.identifier && (
          <Text style={styles.cardErrorText}>{errors.identifier.message}</Text>
        )}

        <Text style={styles.cardLabel}>Contraseña</Text>
        <Controller
          control={control}
          name="password"
          rules={{ required: "Este campo es obligatorio" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.cardInput, errors.password && styles.cardInputError]}
              placeholder="••••••••"
              placeholderTextColor="#c5c5c5"
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
          )}
        />
        {errors.password && (
          <Text style={styles.cardErrorText}>{errors.password.message}</Text>
        )}

        {errorBackend && (
          <Text style={styles.cardErrorText}>{errorBackend}</Text>
        )}

        <TouchableOpacity style={styles.cardButton} onPress={handleSubmit(handleLogin)}>
          <Text style={styles.cardButtonText}>Ingresar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05080a",
  },
  orb1: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#11df5936",
    bottom: -100,
    left: -100,
  },
  orb2: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#11df591e",
    top: 100,
    right: -150,
  },
  btnGoBack: {
    padding: 10,
    borderRadius: 5,
    margin: 10,
    position: "absolute",
    top: 10,
    left: 10,
    width: 100,
    alignItems: "center",
  },
  btnGoBackText: {
    color: "#11df59",
    fontSize: 17,
  },
  mainLogin: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: width * 0.1,
    marginTop: height * 0.1,
  },
  title: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    color: "#c7c7c7",
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#074b21",
    borderRadius: 28,
    padding: 30,
    width: width * 0.85,
    marginTop: height * 0.05,
    alignSelf: "center",
    height: height * 0.48,
    flexDirection: "column",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#1fff6e55",
    shadowColor: "#11df59",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 18,
    gap: 14,
  },
  cardLabel: {
    color: "#d4ffe3",
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 7,
    marginTop: 16,
    textTransform: "uppercase",
    letterSpacing: 1.4,
  },
  cardInput: {
    backgroundColor: "#ffffff12",
    color: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    borderWidth: 1.5,
    borderColor: "#ffffff25",
  },
  cardInputError: {
    borderColor: "#ff6b6b",
    backgroundColor: "#ff000015",
  },
  cardErrorText: {
    color: "#ffe0e0",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 5,
  },
  cardButton: {
    backgroundColor: "#05080a",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: "auto",
    borderWidth: 1,
    borderColor: "#11df5944",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  cardButtonText: {
    color: "#11df59",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
})

export default LoginScreen