import { View, Text, StyleSheet, TouchableOpacity } from "react-native"

const TaskCard = ({ task, onComplete, btnComplete, onDelete }) => {

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <View style={styles.card}>
      <View style={styles.accentBar} />

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {task.title}
        </Text>

        {!!task.description && (
          <Text style={styles.description} numberOfLines={2}>
            {task.description}
          </Text>
        )}


        <View style={styles.dateRow}>
          <Text style={styles.dateIcon}>◷</Text>
          <Text style={styles.dateText}>{formatDate(task.created_at)}</Text>
        </View>

        <View style={styles.buttonsRow}>
          {btnComplete && (
            <TouchableOpacity style={styles.completeButton} onPress={onComplete}>
              <Text style={styles.buttonText}>Marcar como completada</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
            <Text style={styles.buttonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#0b1610",
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#182a1e",
    overflow: "hidden",
    shadowColor: "#3d9e60",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  accentBar: {
    width: 3,
    borderRadius: 2,
    marginVertical: 14,
    marginLeft: 10,
    backgroundColor: "#3d9e60",
  },
  content: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 6,
  },
  title: {
    color: "#ddeae0",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.2,
    lineHeight: 21,
  },
  description: {
    color: "#3a5040",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "400",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  dateIcon: {
    color: "#2d5c3a",
    fontSize: 12,
  },
  dateText: {
    color: "#2d5c3a",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  buttonsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  completeButton: {
    backgroundColor: "#3d9e60",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: "#e03e3e",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});

export default TaskCard;