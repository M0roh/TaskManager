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
          <Text style={styles.createBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      <View>
        {tasks.map((t) => (
          <TouchableOpacity
            key={t.taskId}
            onPress={() =>
              navigation.navigate("TaskDetails", { taskId: t.taskId })
            }
          >
            <TaskListItem task={t}></TaskListItem>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    margin: 5,
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

  createBtnText: {
    fontSize: 30,
    fontWeight: "500",
    color: "#efefef",
  },
});
