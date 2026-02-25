import { View, Text, StyleSheet, Dimensions, StatusBar, TextInput, TouchableOpacity } from "react-native";

import { useForm, Controller } from "react-hook-form";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const { width, height } = Dimensions.get('window');

const RegisterScreen = () => {

    const { register: registerUser, loading } = useContext(AuthContext);

    const [response, setResponse] = useState(null);
    const [errorBackend, setErrorBackend] = useState(null);

    const { control, handleSubmit, formState: { errors }, reset } = useForm(); 

    //control es para manejar el estado del formulario: guardar valores, errores, etc
    //controller es un componente que conecta los inputs con react-hook-form, permitiendo manejar su estado y validación

    const onSubmit = async (data) => {
        try {
            const res = await registerUser(data);
            setResponse(res);
            reset();
        } catch (error) {
            setErrorBackend("Error al registrarse");
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#080c09" />
            <Text style={styles.title}>Registro</Text>

            <View style={styles.form}>

                <Controller
                    control={control}
                    name="name"
                    rules={{ required: "El nombre es obligatorio" }}
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            placeholder="Nombre"
                            style={styles.input}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

                <Controller
                    control={control}
                    name="surname"
                    rules={{ required: "El apellido es obligatorio" }}
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            placeholder="Apellido"
                            style={styles.input}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                {errors.surname && <Text style={styles.error}>{errors.surname.message}</Text>}

                <Controller
                    control={control}
                    name="email"
                    rules={{
                        required: "El email es obligatorio",
                        pattern: {
                            value: /^\S+@\S+$/i,
                            message: "Email inválido"
                        }
                    }}
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            placeholder="Email"
                            style={styles.input}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

                <Controller
                    control={control}
                    name="username"
                    rules={{ required: "El username es obligatorio" }}
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            placeholder="Username"
                            style={styles.input}
                            autoCapitalize="none"
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                {errors.username && <Text style={styles.error}>{errors.username.message}</Text>}

                <Controller
                    control={control}
                    name="password"
                    rules={{
                        required: "La contraseña es obligatoria",
                        minLength: {
                            value: 6,
                            message: "Mínimo 6 caracteres"
                        }
                    }}
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            placeholder="Password"
                            style={styles.input}
                            secureTextEntry
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleSubmit(onSubmit)}
                >
                    <Text style={styles.buttonText}>
                        {loading ? "Cargando..." : "Registrarse"}
                    </Text>
                </TouchableOpacity>

                {errorBackend && <Text style={styles.error}>{errorBackend}</Text>}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#080c09',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        color: "white",
        fontSize: 24,
        marginBottom: 20
    },
    form: {
        width: width * 0.85
    },
    input: {
        backgroundColor: "white",
        padding: 12,
        borderRadius: 8,
        marginBottom: 8
    },
    button: {
        backgroundColor: "#2c3e50",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10
    },
    buttonText: {
        color: "white",
        fontWeight: "bold"
    },
    error: {
        color: "red",
        marginBottom: 8
    }
});

export default RegisterScreen;