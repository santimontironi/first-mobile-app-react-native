import TaskCard from "../components/TaskCard";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TasksCompleted = ({ navigation, route }) => {

    const { completedTasks, loading } = route.params;

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.orb1} />
            <View style={styles.orb2} />
            <View style={styles.orb3} />

            <ScrollView>
                <View style={styles.sectionHeader}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Text style={styles.backIcon}>← Volver</Text>
                    </TouchableOpacity>
                    <Text style={styles.sectionTitle}>Tareas completadas</Text>
                </View>
                {loading ? (
                    <ActivityIndicator style={{ marginTop: 40 }} size="small" color="#3d9e60" />
                ) : completedTasks?.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyEmoji}>✦</Text>
                        <Text style={styles.emptyTitle}>Sin tareas completadas</Text>
                        <Text style={styles.emptySubtitle}>Completa una tarea para que aparezca aquí</Text>
                    </View>
                ) : (
                    completedTasks.map((task, index) => (
                        <TaskCard key={index} task={task} />
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0b1610",
    },
    orb1: {
        position: "absolute",
        top: 250,
        left: -40,
        width: 160,
        height: 160,
        backgroundColor: "#3d9e60",
        borderRadius: 100,
        opacity: 0.06
    },
    orb2: {
        position: "absolute",
        top: 350,
        right: -30,
        width: 150,
        height: 150,
        backgroundColor: "#3d9e60",
        borderRadius: 100,
        opacity: 0.09
    },
    orb3: {
        position: "absolute",
        bottom: 150,
        left: -50,
        width: 130,
        height: 130,
        backgroundColor: "#3d9e60",
        borderRadius: 65,
        opacity: 0.05
    },
    sectionHeader: {
        padding: 16,
        gap: 20
    },
    sectionTitle: {
        color: "#ddeae0",
        fontSize: 24,
        fontWeight: "700",
    },
    backButton: {
        marginRight: 16,
    },
    backIcon: {
        color: "#ddeae0",
        fontSize: 20,
        fontWeight: "700",
    },
    emptyState: {
        marginTop: 80,
        alignItems: "center",
        gap: 12,
    },
    emptyEmoji: {
        fontSize: 48,
    },
    emptyTitle: {
        color: "#ddeae0",   
        fontSize: 18,
        fontWeight: "700",
    },
    emptySubtitle: {
        color: "#3a5040",
        fontSize: 14,
    },
})

export default TasksCompleted