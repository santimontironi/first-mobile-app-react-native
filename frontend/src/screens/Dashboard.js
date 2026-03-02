import { View, Text, ActivityIndicator, Dimensions, StatusBar, TouchableOpacity, ScrollView, StyleSheet } from "react-native"
import { useContext, useEffect } from "react"
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../context/AuthContext";
import { TaskContext } from "../context/TaskContext";
import TaskCard from "../components/TaskCard";

const { width, height } = Dimensions.get("window");

const Dashboard = ({ navigation }) => {

  const { user, loading, logoutUser, setUser } = useContext(AuthContext);

  const { taskList, loading: taskLoading, fetchTasks } = useContext(TaskContext);

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#05080a" />

      <View style={styles.orb1} />
      <View style={styles.orb2} />

      {loading.dashboard ? (
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
      ) : (
        <View>

        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05080a",
  }
});
export default Dashboard