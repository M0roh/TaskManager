import { View } from "react-native";
import TaskListItem from "../components/TaskListItem";
import { useTaskStore } from "../stores/tasksStore";

export default function HomeScreen() {
  const tasks = useTaskStore((state) => state.tasks);

  return (
    <View>
      {tasks.map((t) => (
        <TaskListItem key={t.taskId} task={t}></TaskListItem>
      ))}
    </View>
  );
}
