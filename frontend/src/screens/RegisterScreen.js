import { View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, StatusBar } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const RegisterScreen = ({ navigation }) => {
    const { registerUser, loading } = useContext(AuthContext);
    const [response, setResponse] = useState(null);
    const [errorBackend, setErrorBackend] = useState(null);

    const { control,handleSubmit,formState: { errors },reset } = useForm();

    const onSubmit = async (data) => {
        try {
            const res = await registerUser(data);
            navigation.navigate("ConfirmUser", {token: res.token})
            setErrorBackend(null);
            reset();
        } catch (error) {
            setErrorBackend(
                error.response?.data?.error
            );
            setResponse(null);
        }
    };

    return (
        <SafeAreaView style={styles.safeContainer}>
            <StatusBar barStyle="light-content" backgroundColor="#05080a" />

            <View style={styles.orb1} />
            <View style={styles.orb2} />

            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Text style={styles.backText}>← Volver</Text>
                </TouchableOpacity>

                <View style={styles.header}>
                    <Text style={styles.title}>Crear cuenta</Text>
                    <Text style={styles.subtitle}>
                        Únete y empieza tu experiencia hoy.
                    </Text>
                </View>

                <View style={styles.formCard}>
                    {loading?.register ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#3ecf6e" />
                            <Text style={styles.loadingText}>Creando cuenta…</Text>
                        </View>
                    ) : (
                        <>
                            <Controller
                                control={control}
                                name="name"
                                rules={{ required: "El nombre es requerido" }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View style={styles.fieldWrapper}>
                                        <Text style={styles.label}>Nombre</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Tu nombre"
                                            placeholderTextColor="#2e5040"
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                        />
                                        {errors.name && (
                                            <Text style={styles.error}>{errors.name.message}</Text>
                                        )}
                                    </View>
                                )}
                            />

                            <Controller
                                control={control}
                                name="surname"
                                rules={{ required: "El apellido es requerido" }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View style={styles.fieldWrapper}>
                                        <Text style={styles.label}>Apellido</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Tu apellido"
                                            placeholderTextColor="#2e5040"
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                        />
                                        {errors.surname && (
                                            <Text style={styles.error}>
                                                {errors.surname.message}
                                            </Text>
                                        )}
                                    </View>
                                )}
                            />

                            <Controller
                                control={control}
                                name="email"
                                rules={{
                                    required: "El email es requerido",
                                    pattern: {
                                        value: /^\S+@\S+$/i,
                                        message: "Email inválido",
                                    },
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View style={styles.fieldWrapper}>
                                        <Text style={styles.label}>Correo electrónico</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="correo@ejemplo.com"
                                            placeholderTextColor="#2e5040"
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            autoCapitalize="none"
                                        />
                                        {errors.email && (
                                            <Text style={styles.error}>{errors.email.message}</Text>
                                        )}
                                    </View>
                                )}
                            />

                            <Controller
                                control={control}
                                name="username"
                                rules={{ required: "El usuario es requerido" }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View style={styles.fieldWrapper}>
                                        <Text style={styles.label}>Usuario</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="@usuario"
                                            placeholderTextColor="#2e5040"
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            autoCapitalize="none"
                                        />
                                        {errors.username && (
                                            <Text style={styles.error}>
                                                {errors.username.message}
                                            </Text>
                                        )}
                                    </View>
                                )}
                            />

                            <Controller
                                control={control}
                                name="password"
                                rules={{
                                    required: "La contraseña es requerida"
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View style={styles.fieldWrapper}>
                                        <Text style={styles.label}>Contraseña</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="••••••••"
                                            placeholderTextColor="#2e5040"
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            secureTextEntry
                                            autoCapitalize="none"
                                        />
                                        {errors.password && (
                                            <Text style={styles.error}>
                                                {errors.password.message}
                                            </Text>
                                        )}
                                    </View>
                                )}
                            />

                            {errorBackend && (
                                <Text style={styles.backendError}>{errorBackend}</Text>
                            )}

                            {response && (
                                <Text style={styles.successText}>{response}</Text>
                            )}

                            <TouchableOpacity
                                style={styles.button}
                                onPress={handleSubmit(onSubmit)}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.buttonText}>Crear cuenta</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.loginLink}
                                onPress={() => navigation.navigate("Login")}
                            >
                                <Text style={styles.loginLinkText}>
                                    ¿Ya tienes cuenta?{" "}
                                    <Text style={styles.loginLinkBold}>Inicia sesión</Text>
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: "#05080a",
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 28,
    },
    title: {
        fontSize: 36,
        fontWeight: "800",
        color: "#e2f0e7",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: "#4a7a5a",
    },
    formCard: {
        backgroundColor: "#0a120c",
        borderRadius: 20,
        padding: 20,
    },
    fieldWrapper: {
        marginBottom: 16,
    },
    label: {
        fontSize: 13,
        fontWeight: "600",
        marginBottom: 6,
        color: "#3ecf6e",
    },
    input: {
        borderWidth: 1,
        borderColor: "#1e3828",
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 14,
        color: "#d4ead9",
        backgroundColor: "#081009",
    },
    error: {
        color: "#e05c5c",
        fontSize: 12,
        marginTop: 4,
    },
    backendError: {
        color: "#ff6b6b",
        marginBottom: 12,
        fontSize: 13,
    },
    successText: {
        color: "#3ecf6e",
        marginBottom: 12,
        fontSize: 13,
    },
    button: {
        marginTop: 8,
        borderRadius: 14,
        backgroundColor: "#1e8c45",
        paddingVertical: 14,
        alignItems: "center",
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 15,
        fontWeight: "700",
    },
    loginLink: {
        marginTop: 18,
        alignItems: "center",
    },
    loginLinkText: {
        color: "#4a7a5a",
        fontSize: 13,
    },
    loginLinkBold: {
        color: "#3ecf6e",
        fontWeight: "700",
    },
    backButton: {
        marginBottom: 24,
    },
    backText: {
        color: "#3ecf6e",
        fontSize: 14,
        fontWeight: "600",
    },
    loadingContainer: {
        alignItems: "center",
        paddingVertical: 30,
    },
    loadingText: {
        marginTop: 10,
        color: "#4a7a5a",
    },
    orb1: {
        position: "absolute",
        width: width * 1.1,
        height: width * 1.1,
        borderRadius: width,
        backgroundColor: "#0b2016",
        top: -width * 0.5,
        right: -width * 0.3,
        opacity: 0.6,
    },
    orb2: {
        position: "absolute",
        width: width * 0.7,
        height: width * 0.7,
        borderRadius: width,
        backgroundColor: "#071a0f",
        bottom: height * 0.05,
        left: -width * 0.3,
        opacity: 0.6,
    },
});

export default RegisterScreen;