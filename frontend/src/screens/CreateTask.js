import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, ScrollView, ActivityIndicator } from "react-native"
import { useContext } from "react"
import { useForm, Controller } from "react-hook-form"
import { SafeAreaView } from "react-native-safe-area-context"
import { TaskContext } from "../context/TaskContext"

const CreateTask = ({ navigation }) => {
    const { createTask, loading } = useContext(TaskContext)

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            title: "",
            description: "",
        }
    })

    const onSubmit = async (data) => {
        try{
            await createTask(data)
            navigation.goBack()
        }
        catch(error){
            console.log(error?.response?.data?.error)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#05080a" />

            <View style={styles.orb1} />
            <View style={styles.orb2} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.headerSub}>Nueva tarea</Text>
                        <Text style={styles.headerTitle}>Crear tarea</Text>
                    </View>
                </View>

                <View style={styles.form}>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>
                            Título <Text style={styles.required}>*</Text>
                        </Text>
                        <Controller
                            control={control}
                            name="title"
                            rules={{ required: "El título es obligatorio", maxLength: { value: 100, message: "Máximo 100 caracteres" } }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={[styles.inputWrapper, errors.title && styles.inputWrapperError]}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="¿Qué necesitás hacer?"
                                        placeholderTextColor="#2a3d2e"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        maxLength={100}
                                    />
                                </View>
                            )}
                        />
                        {errors.title && (
                            <Text style={styles.errorText}>⚠ {errors.title.message}</Text>
                        )}
                    </View>
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>
                            Descripción <Text style={styles.optional}>(opcional)</Text>
                        </Text>
                        <Controller
                            control={control}
                            name="description"
                            rules={{ maxLength: { value: 500, message: "Máximo 500 caracteres" } }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View style={[styles.inputWrapper, styles.textAreaWrapper, errors.description && styles.inputWrapperError]}>
                                    <TextInput
                                        style={[styles.input, styles.textArea]}
                                        placeholder="Agregá más detalles sobre la tarea..."
                                        placeholderTextColor="#2a3d2e"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        multiline
                                        numberOfLines={5}
                                        textAlignVertical="top"
                                        maxLength={500}
                                    />
                                </View>
                            )}
                        />
                        {errors.description && (
                            <Text style={styles.errorText}>⚠ {errors.description.message}</Text>
                        )}
                    </View>

                </View>

                <TouchableOpacity
                    style={[styles.submitButton, loading.create && styles.submitButtonDisabled]}
                    onPress={handleSubmit(onSubmit)}
                    disabled={loading.create}
                    activeOpacity={0.85}
                >
                    {loading.create ? (
                        <ActivityIndicator color="#fff" size="small" />
                    ) : (
                        <>
                            <Text style={styles.submitIcon}>✦</Text>
                            <Text style={styles.submitText}>Crear tarea</Text>
                        </>
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>

            </ScrollView>
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
        top: -60,
        left: -80,
        width: 260,
        height: 260,
        borderRadius: 130,
        backgroundColor: "#3d9e60",
        opacity: 0.07,
    },
    orb2: {
        position: "absolute",
        bottom: 80,
        right: -100,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: "#28e269",
        opacity: 0.05,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 48,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        marginTop: 20,
        marginBottom: 36,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#0c1410",
        borderWidth: 1,
        borderColor: "#1a2b1e",
        justifyContent: "center",
        alignItems: "center",
    },
    backIcon: {
        color: "#3d9e60",
        fontSize: 18,
        fontWeight: "700",
    },
    headerSub: {
        color: "#2d5c3a",
        fontSize: 12,
        fontWeight: "600",
        letterSpacing: 0.5,
        textTransform: "uppercase",
        marginBottom: 2,
    },
    headerTitle: {
        color: "#e8f0ea",
        fontSize: 22,
        fontWeight: "700",
        letterSpacing: -0.5,
    },
    form: {
        gap: 20,
        marginBottom: 32,
    },
    fieldGroup: {
        gap: 6,
    },
    label: {
        color: "#8aab90",
        fontSize: 13,
        fontWeight: "600",
        letterSpacing: 0.3,
        marginBottom: 2,
    },
    required: {
        color: "#3d9e60",
    },
    optional: {
        color: "#2d4a33",
        fontWeight: "400",
    },
    inputWrapper: {
        backgroundColor: "#0b1610",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#182a1e",
    },
    inputWrapperError: {
        borderColor: "#7a2a2a",
        backgroundColor: "#110b0b",
    },
    textAreaWrapper: {
        minHeight: 120,
    },
    input: {
        color: "#ddeae0",
        fontSize: 15,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontWeight: "400",
    },
    textArea: {
        minHeight: 120,
    },
    errorText: {
        color: "#a04040",
        fontSize: 11,
        fontWeight: "600",
    },
    submitButton: {
        backgroundColor: "#3d9e60",
        borderRadius: 16,
        paddingVertical: 16,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        shadowColor: "#3d9e60",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 6,
    },
    submitButtonDisabled: {
        opacity: 0.5,
    },
    submitIcon: {
        color: "#fff",
        fontSize: 13,
    },
    submitText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
        letterSpacing: 0.2,
    },
    cancelButton: {
        marginTop: 14,
        alignItems: "center",
        paddingVertical: 12,
    },
    cancelText: {
        color: "#2d4a33",
        fontSize: 14,
        fontWeight: "600",
    },
})

export default CreateTask