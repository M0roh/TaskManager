import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useMemo, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import TaskListItem from "../components/TaskListItem";
import { useTaskStore } from "../stores/tasksStore";
import Task from "../types/task";

export type StatusFilter = "All" | Task["status"];
export type SortField = "deadline" | "title" | "status";
export type SortOrder = "asc" | "desc";

const STATUSES: StatusFilter[] = [
  "All",
  "New",
  "In Progress",
  "Completed",
  "Canceled",
];

export default function HomeScreen() {
  const navigation = useNavigation<any>();

  const tasks = useTaskStore((state) => state.tasks);

  const [activeStatus, setActiveStatus] = useState<StatusFilter>("All");
  const [sortField, setSortField] = useState<SortField>("deadline");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const processedTasks = useMemo(() => {
    let result = [...tasks];
    if (activeStatus !== "All") {
      result = result.filter((task) => task.status === activeStatus);
    }

    result.sort((a, b) => {
      if (sortField === "title") {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();

        if (titleA < titleB) return sortOrder === "asc" ? -1 : 1;
        if (titleA > titleB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      } else if (sortField === "status") {
        const statusA = a.status.toLowerCase();
        const statusB = b.status.toLowerCase();

        if (statusA < statusB) return sortOrder === "asc" ? -1 : 1;
        if (statusA > statusB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      } else {
        const dateA = new Date(a.deadline).getTime();
        const dateB = new Date(b.deadline).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      }
    });

    return result;
  }, [tasks, activeStatus, sortField, sortOrder]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.toolbar}>
        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => navigation.navigate("AddTask")}
        >
          <Ionicons name={"add-outline"} size={25} color={"#FCE3EF"} />
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.statusScroll}
          >
            {STATUSES.map((status) => {
              const isActive = activeStatus === status;
              return (
                <TouchableOpacity
                  key={status}
                  onPress={() => setActiveStatus(status)}
                  style={[
                    styles.statusChip,
                    isActive && styles.statusChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      isActive && styles.statusTextActive,
                    ]}
                  >
                    {status}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.sortRow}>
          <View style={styles.sortOptions}>
            <Text style={styles.sortLabel}>Sort by:</Text>

            <TouchableOpacity
              onPress={() => setSortField("deadline")}
              style={[
                styles.sortFieldBtn,
                sortField === "deadline" && styles.sortFieldBtnActive,
              ]}
            >
              <Text
                style={[
                  styles.sortFieldText,
                  sortField === "deadline" && styles.sortFieldTextActive,
                ]}
              >
                Deadline
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSortField("title")}
              style={[
                styles.sortFieldBtn,
                sortField === "title" && styles.sortFieldBtnActive,
              ]}
            >
              <Text
                style={[
                  styles.sortFieldText,
                  sortField === "title" && styles.sortFieldTextActive,
                ]}
              >
                Title
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSortField("status")}
              style={[
                styles.sortFieldBtn,
                sortField === "status" && styles.sortFieldBtnActive,
              ]}
            >
              <Text
                style={[
                  styles.sortFieldText,
                  sortField === "status" && styles.sortFieldTextActive,
                ]}
              >
                Status
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={toggleSortOrder}
            style={styles.directionBtn}
          >
            <Ionicons
              name={sortOrder === "asc" ? "arrow-up" : "arrow-down"}
              size={18}
              color="#1F2937"
            />
            <Text style={styles.directionText}>{sortOrder.toUpperCase()}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        {processedTasks.length > 0 ? (
          <FlatList
            data={processedTasks}
            keyExtractor={(t) => t.taskId}
            contentContainerStyle={{ paddingBottom: 120, paddingTop: 10 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                key={item.taskId}
                onPress={() =>
                  navigation.navigate("TaskDetails", { taskId: item.taskId })
                }
              >
                <TaskListItem task={item} />
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text style={styles.emptyText}>You dont have any tasks.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyText: {
    textAlign: "center",
    marginTop: 15,

    fontWeight: "600",
    fontSize: 16,
  },

  toolbar: {
    width: "90%",
    alignSelf: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    margin: 5,
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#45454545",
  },

  createBtn: {
    width: "80%",
    alignSelf: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    marginVertical: 5,

    backgroundColor: "#289eec",
    height: 40,
    borderRadius: 8,
  },

  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  statusScroll: {
    gap: 8,
  },
  statusChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  statusChipActive: {
    backgroundColor: "#289efe",
    borderColor: "#289efe",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4B5563",
  },
  statusTextActive: {
    color: "#FFFFFF",
  },
  sortRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sortOptions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sortLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
    marginRight: 4,
  },
  sortFieldBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  sortFieldBtnActive: {
    backgroundColor: "#E0F2FE",
  },
  sortFieldText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  sortFieldTextActive: {
    color: "#0369A1",
  },
  directionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  directionText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1F2937",
  },
});
