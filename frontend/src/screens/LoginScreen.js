import { View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, StatusBar, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {

  const { control, handleSubmit, formState: { errors } } = useForm();

  const { loginUser, loading } = useContext(AuthContext);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#05080a" />

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
      ) : null}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05080a",
  },
})

export default LoginScreen