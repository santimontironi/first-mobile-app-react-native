import { View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, StatusBar } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {

  const { control, handleSubmit, formState: { errors } } = useForm();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#05080a" />
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