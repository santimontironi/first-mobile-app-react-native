import { useContext, useEffect, useState } from "react";
import { View, Text, Dimensions, TextInput, TouchableOpacity, StatusBar, StyleSheet, ActivityIndicator } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useForm, Controller } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const ConfirmUser = ({ navigation, route }) => {
    const { token } = route.params;
    const { confirmUser, loading } = useContext(AuthContext);

    const { control, handleSubmit, formState: { errors }, reset } = useForm();

    const [response, setResponse] = useState(null);
    const [errorBackend, setErrorBackend] = useState(null);

    useEffect(() => {
        if (!token) {
            navigation.navigate("Home");
        }
    }, [token]);

    const onSubmit = async ({ code }) => {
        try {
            const res = await confirmUser({ token, code });
            setResponse(res.data.message);
            setErrorBackend(null);
            reset();

            setTimeout(() => {
                navigation.navigate("Login");
            }, 1500);
        } catch (error) {
            setErrorBackend(
                error.response?.data?.message || "Error al confirmar la cuenta"
            );
            setResponse(null);
        }
    };

    return (
        <SafeAreaView style={styles.safeContainer}>
            <StatusBar barStyle="light-content" backgroundColor="#05080a" />

            <View style={styles.orb1} />
            <View style={styles.orb2} />

            <View style={styles.container}>
                <Text style={styles.title}>Confirmar cuenta</Text>
                <Text style={styles.subtitle}>
                    Ingresá el código que enviamos a tu correo
                </Text>

                <View style={styles.card}>
                    <Controller
                        control={control}
                        name="code"
                        rules={{ required: "El código es obligatorio", minLength: { value: 6, message: "El código debe tener 6 dígitos" }, maxLength: { value: 6, message: "El código debe tener 6 dígitos" } }}
                        render={({ field: { onChange, value } }) => (
                            <>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Código de 6 dígitos"
                                    placeholderTextColor="#2e5040"
                                    keyboardType="numeric"
                                    maxLength={6}
                                    value={value}
                                    onChangeText={onChange}
                                />
                                {errors.code && (
                                    <Text style={styles.error}>{errors.code.message}</Text>
                                )}
                            </>
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
                        disabled={loading.confirm}
                        activeOpacity={0.8}
                    >
                        {loading.confirm ? (
                            <ActivityIndicator color="#ffffff" />
                        ) : (
                            <Text style={styles.buttonText}>Confirmar cuenta</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: "#05080a",
    },
    container: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: "center",
    },
    title: {
        fontSize: 32,
        fontWeight: "800",
        color: "#e2f0e7",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: "#4a7a5a",
        marginBottom: 28,
    },
    card: {
        backgroundColor: "#0a120c",
        borderRadius: 20,
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "#1e3828",
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 16,
        color: "#d4ead9",
        backgroundColor: "#081009",
        fontSize: 18,
        textAlign: "center",
        letterSpacing: 4,
    },
    error: {
        color: "#e05c5c",
        fontSize: 12,
        marginTop: 6,
    },
    backendError: {
        color: "#ff6b6b",
        marginTop: 12,
        fontSize: 13,
        textAlign: "center",
    },
    successText: {
        color: "#3ecf6e",
        marginTop: 12,
        fontSize: 13,
        textAlign: "center",
    },
    button: {
        marginTop: 20,
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

export default ConfirmUser;