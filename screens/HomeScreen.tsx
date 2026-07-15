import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import TaskListItem from "../components/TaskListItem";
import { useTaskStore } from "../stores/tasksStore";

export default function HomeScreen() {
  const tasks = useTaskStore((state) => state.tasks);

  const navigation = useNavigation<any>();

  return (
    <View>
      <View style={styles.toolbar}>
        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => navigation.navigate("AddTask")}
        >
          <Ionicons name={"add-outline"} size={25} color={"#FCE3EF"} />
        </TouchableOpacity>
      </View>

      <View>
        {tasks.length > 0 ? (
          tasks.map((t) => (
            <TouchableOpacity
              key={t.taskId}
              onPress={() =>
                navigation.navigate("TaskDetails", { taskId: t.taskId })
              }
            >
              <TaskListItem task={t}></TaskListItem>
            </TouchableOpacity>
          ))
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
    flexDirection: "row",
    justifyContent: "space-around",
    margin: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#45454545",
  },

  createBtn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    marginVertical: 5,

    backgroundColor: "#289eec",
    width: 40,
    height: 40,
    borderRadius: 8,
  },
});
