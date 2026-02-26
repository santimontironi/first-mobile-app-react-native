import { useContext, useState } from "react"
import { View, Text, Dimensions, TextInput, TouchableOpacity, StatusBar, StyleSheet } from "react-native"
import { AuthContext } from "../context/AuthContext"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useForm } from "react-hook-form"

import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const ConfirmUser = () => {

    const { control, handleSubmit, formState: { errors }, reset } = useForm();

    const { confirmUser, loading } = useContext(AuthContext)

    const [response, setResponse] = useState(null);
    const [errorBackend, setErrorBackend] = useState(null);

    const token = AsyncStorage.getItem("token")

    const handleConfirmUser = async (email) => {
        try {
            const res = await confirmUser(email, token);
            setResponse(res.data.message);
            setErrorBackend(null);
            reset();
        }
        catch (error) {
            setErrorBackend(error.response?.data?.message || "Error al confirmar el usuario")
        }
    }

    return (
        <SafeAreaView>
            <StatusBar barStyle="light-content" backgroundColor="#05080a" />
            <View>
                <Text>ConfirmUser</Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({

})

export default ConfirmUser