import React from "react";

import { StyleSheet, Text, View } from "react-native";
import Task from "../types/task";
import { formatDate } from "../utils";

interface TaskListItemParams {
  task: Task;
}

const TaskListItem = React.memo(({ task }: TaskListItemParams) => {
  return (
    <View style={styles.listItem}>
      <Text
        style={[styles.status, STATUS_STYLES[task.status] || styles.newStatus]}
      >
        {task.status}
      </Text>

      <View style={styles.mainInfo}>
        <Text style={styles.title}>{task.title}</Text>
        <Text>{task.description}</Text>
      </View>

      <Text style={styles.dueDate}>Срок: {formatDate(task.dueDate)}</Text>

      <Text style={styles.createdDate}>{formatDate(task.createdDate)}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  listItem: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    padding: 10,
    margin: 5,

    backgroundColor: "#fcfcfc",
    borderColor: "#626262",
    borderWidth: 1,
    borderRadius: 12,
  },

  mainInfo: {
    display: "flex",
    flexDirection: "column",
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
  },

  status: {
    position: "absolute",
    top: 7,
    right: 7,
    padding: 6,

    borderWidth: 1,
    borderColor: "#858585",
    borderRadius: 8,
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

  createdDate: {
    position: "absolute",
    bottom: 0,
    right: 3,
    padding: 5,

    opacity: 0.6,
    fontSize: 13,
  },

  dueDate: {
    marginTop: 10,
  },
});

export default TaskListItem;

const STATUS_STYLES: Record<Task["status"], any> = {
  Completed: styles.completedStatus,
  "In Progress": styles.inProgressStatus,
  New: styles.newStatus,
};
