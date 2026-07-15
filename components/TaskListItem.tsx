import React from "react";

import { Text, View } from "react-native";
import Task from "../types/task";

interface TaskListItemParams {
  task: Task;
}

const TaskListItem = React.memo(({ task }: TaskListItemParams) => {
  return (
    <View>
      <Text>{task.title}</Text>
      <Text>{task.description}</Text>
      <Text>{task.status}</Text>
      <Text>{task.createdDate}</Text>
      <Text>{task.dueDate}</Text>
    </View>
  );
});

export default TaskListItem;
