import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import TaskMap from "../components/TaskMap";
import { useTaskStore } from "../stores/tasksStore";
import Task from "../types/task";
import { formatDate } from "../utils";

interface TaskDetailsScreenProps {
  route: {
    params: {
      taskId: string;
    };
  };
}

export default function TaskDetailScreen({ route }: TaskDetailsScreenProps) {
  const liveTask = useTaskStore((state) =>
    state.tasks.find((t) => t.taskId === route.params.taskId),
  );
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const updateTaskStatus = useTaskStore((state) => state.updateTaskStatus);

  const navigation = useNavigation<any>();

  const [task, setTask] = useState(liveTask);

  useEffect(() => {
    if (liveTask) {
      setTask(liveTask);
    }
  }, [liveTask]);

  if (!task)
    return (
      <View>
        <Text style={styles.notFoundText}>Error. Task not Found</Text>
      </View>
    );

  const handleDeleteTask = () => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task? This action cannot be undone.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            navigation.navigate("Home");
            deleteTask(task.taskId);
          },
          style: "destructive",
        },
      ],
      { cancelable: true },
    );
  };

  const handleCancelTask = () => {
    Alert.alert(
      "Cancel Task",
      "Are you sure you want to cancel this task? This action cannot be undone.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            updateTaskStatus(task.taskId, "Canceled");
          },
          style: "destructive",
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.headerRow}>
        <View
          style={[
            styles.statusBadge,
            STATUS_STYLES[task.status] || styles.newStatus,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              STATUS_STYLES[task.status] || styles.newStatus,
            ]}
          >
            {task.status}
          </Text>
        </View>

        <View style={styles.syncRow}>
          <Ionicons
            name={
              task.syncStatus ? "cloud-done-outline" : "cloud-offline-outline"
            }
            size={18}
            color={task.syncStatus ? "#10B981" : "#9CA3AF"}
          />
          <Text
            style={[
              styles.syncText,
              { color: task.syncStatus ? "#10B981" : "#9CA3AF" },
            ]}
          >
            {task.syncStatus ? "Synced" : "Local"}
          </Text>
        </View>
      </View>

      <Text style={styles.title}>{task.title}</Text>
      <Text style={styles.description}>
        {task.description || "Описания нет"}
      </Text>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dates</Text>

        <View style={styles.infoCard}>
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={20} color="#6B7280" />
            <View style={styles.dateTexts}>
              <Text style={styles.dateLabel}>Created at</Text>
              <Text style={styles.dateValue}>
                {formatDate(task.createdDate)}
              </Text>
            </View>
          </View>

          <View style={[styles.dateRow, { marginTop: 16 }]}>
            <Ionicons name="alarm-outline" size={20} color="#EF4444" />
            <View style={styles.dateTexts}>
              <Text style={styles.dateLabel}>Deadline</Text>
              <Text
                style={[
                  styles.dateValue,
                  { color: "#EF4444", fontWeight: "600" },
                ]}
              >
                {formatDate(task.deadline)}
              </Text>
            </View>
          </View>

          {task.status === "Completed" && task.completedDate && (
            <View style={[styles.dateRow, { marginTop: 16 }]}>
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="#10B981"
              />
              <View style={styles.dateTexts}>
                <Text style={styles.dateLabel}>Completed at</Text>
                <Text
                  style={[
                    styles.dateValue,
                    { color: "#10B981", fontWeight: "600" },
                  ]}
                >
                  {task.completedDate}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Address</Text>

        {task.location ? (
          <View style={styles.infoCard}>
            <View style={styles.locationHeader}>
              <Ionicons name="location-outline" size={20} color="#3B82F6" />
              <Text style={styles.addressText} numberOfLines={2}>
                {task.location.address}
              </Text>
            </View>

            <TaskMap
              latitude={task.location?.latitude}
              longitude={task.location?.longitude}
              address={task.location?.address}
            />
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Ionicons name="location-outline" size={24} color="#9CA3AF" />
            <Text style={styles.emptyCardText}>Address not specified</Text>
          </View>
        )}
      </View>

      <View style={styles.toolbar}>
        <TouchableOpacity
          style={[styles.btn, styles.cancelBtn]}
          onPress={handleCancelTask}
        >
          <Ionicons name={"close-circle-outline"} size={18} color={"#FCE3EF"} />
          <Text style={[{ color: "#FCE3EF", fontWeight: "700" }]}>
            {"Cancel"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.deleteBtn]}
          onPress={handleDeleteTask}
        >
          <Ionicons name={"trash-bin-outline"} size={18} color={"#FCE3EF"} />
          <Text style={[{ color: "#FCE3EF", fontWeight: "700" }]}>
            {"Delete"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  notFoundText: {
    fontWeight: "700",
    fontSize: 20,
    width: "100%",
    textAlign: "center",
    marginVertical: 20,
  },

  toolbar: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    gap: 15,
  },

  btn: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    gap: 10,
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#EF4444",
  },

  cancelBtn: {
    backgroundColor: "#9e9d9d",
  },

  deleteBtn: {
    backgroundColor: "#EF4444",
  },

  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
  },
  syncRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  syncText: {
    fontSize: 12,
    fontWeight: "500",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
    lineHeight: 32,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#4B5563",
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 10,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dateTexts: {
    flexDirection: "column",
  },
  dateLabel: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  dateValue: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "500",
    marginTop: 2,
  },
  locationHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 12,
  },
  addressText: {
    fontSize: 14,
    color: "#1F2937",
    flex: 1,
    lineHeight: 20,
  },
  mapPlaceholder: {
    height: 120,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#D1D5DB",
    padding: 10,
  },
  mapPlaceholderText: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 6,
  },
  coordinatesText: {
    fontSize: 10,
    color: "#9CA3AF",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    marginTop: 4,
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
  },
  emptyCardText: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 8,
  },

  newStatus: {
    backgroundColor: "#087eeb",
    color: "#fefefe",
  },

  inProgressStatus: {
    backgroundColor: "#e4d60b",
  },

  completedStatus: {
    backgroundColor: "#48e777",
  },

  cancelledStatus: {
    backgroundColor: "#898989",
  },
});

const STATUS_STYLES: Record<Task["status"], any> = {
  Completed: styles.completedStatus,
  "In Progress": styles.inProgressStatus,
  New: styles.newStatus,
  Canceled: styles.cancelledStatus,
};
