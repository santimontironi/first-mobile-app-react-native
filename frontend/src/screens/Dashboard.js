import { View, Text, ActivityIndicator, Dimensions, StatusBar, TouchableOpacity, ScrollView, StyleSheet } from "react-native"
import { useContext, useEffect } from "react"
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../context/AuthContext";
import { TaskContext } from "../context/TaskContext";
import TaskCard from "../components/TaskCard";

const { width, height } = Dimensions.get("window");

const Dashboard = ({ navigation }) => {
  const { user, loading, logoutUser } = useContext(AuthContext);
  const { taskList, loading: taskLoading, fetchTasks } = useContext(TaskContext);

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    navigation.replace("Home");
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#05080a" />

      <View style={styles.orb1} />
      <View style={styles.orb2} />
      <View style={styles.orb3} />

      {loading.dashboard ? (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#3d9e60" />
            <Text style={styles.loadingText}>Cargando...</Text>
          </View>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Bienvenido 👋</Text>
              <Text style={styles.username}>{user?.name ?? "Usuario"}</Text>
            </View>
            <TouchableOpacity style={styles.avatarButton} onPress={handleLogout}>
              <Text style={styles.avatarText}>
                {user?.name?.[0]?.toUpperCase() ?? "U"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{taskList?.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={[styles.statCard, styles.statCardAccent]}>
              <Text style={[styles.statNumber, styles.statNumberAccent]}>
                {taskList?.filter(t => t.is_completed).length}
              </Text>
              <Text style={[styles.statLabel, styles.statLabelAccent]}>Completadas</Text>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mis tareas pendientes</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("CreateTask")}>
              <Text style={styles.addButtonText}>+ Nueva</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {taskLoading.tasks ? (
            <ActivityIndicator style={{ marginTop: 40 }} size="small" color="#3d9e60" />
          ) : taskList?.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>✦</Text>
              <Text style={styles.emptyTitle}>Sin tareas aún</Text>
              <Text style={styles.emptySubtitle}>Crea tu primera tarea para comenzar</Text>
            </View>
          ) : (
            taskList.map((task, index) => (
              <TaskCard key={task.id ?? index} task={task} index={index} />
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

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
  orb3: {
    position: "absolute",
    top: height * 0.4,
    left: width * 0.3,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#3d9e60",
    opacity: 0.04,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 28,
  },
  greeting: {
    color: "#4d5a50",
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  username: {
    color: "#e8f0ea",
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  avatarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#0f1f14",
    borderWidth: 1.5,
    borderColor: "#3d9e60",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#3d9e60",
    fontSize: 17,
    fontWeight: "700",
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#0c1410",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1a2b1e",
  },
  statCardAccent: {
    backgroundColor: "#0f2018",
    borderColor: "#2a5c36",
  },
  statNumber: {
    color: "#c8d8cb",
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -1,
  },
  statNumberAccent: {
    color: "#3d9e60",
  },
  statLabel: {
    color: "#3a4d3e",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginTop: 2,
  },
  statLabelAccent: {
    color: "#2d6640",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#d0ddd3",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  addButton: {
    backgroundColor: "#3d9e60",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  divider: {
    height: 1,
    backgroundColor: "#0b7a29",
    marginBottom: 16,
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: "#0c1410",
  },
  emptyEmoji: {
    fontSize: 36,
    color: "#fff",
    marginBottom: 14,
  },
  emptyTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  emptySubtitle: {
    color: "#fff",
    fontSize: 13,
    textAlign: "center",
  },
});

export default Dashboard;