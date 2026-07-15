import React from "react";

import { Platform, StyleSheet, Text, View } from "react-native";
import Task from "../types/task";
import { formatDate } from "../utils";

interface TaskListItemParams {
  task: Task;
}

const TaskListItem = React.memo(({ task }: TaskListItemParams) => {
  return (
    <View style={styles.listItem}>
      {/* Верхний ряд: Заголовок и Статус */}
      <View style={styles.headerRow}>
        <Text style={styles.title} numberOfLines={1}>
          {task.title}
        </Text>
        <Text
          style={[
            styles.status,
            STATUS_STYLES[task.status] || styles.newStatus,
          ]}
        >
          {task.status}
        </Text>
      </View>

      {/* Описание (не бросается в глаза, шрифт чуть меньше и мягче) */}
      {task.description ? (
        <Text style={styles.description} numberOfLines={2}>
          {task.description}
        </Text>
      ) : null}

      {/* Нижний ряд: Сроки и Дата создания разнесены по сторонам */}
      <View style={styles.footerRow}>
        <Text style={styles.dueDate}>Срок: {formatDate(task.deadline)}</Text>
        <Text style={styles.createdDate}>{formatDate(task.createdDate)}</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    marginVertical: 6,
    marginHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
  },

  description: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
    marginBottom: 12,
  },

  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 8,
  },

  status: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: "600",
    overflow: "hidden",
  },

  newStatus: {
    backgroundColor: "#EFF6FF",
    color: "#1D4ED8",
  },

  inProgressStatus: {
    backgroundColor: "#FFFBEB",
    color: "#B45309",
  },

  completedStatus: {
    backgroundColor: "#ECFDF5",
    color: "#047857",
  },

  dueDate: {
    fontSize: 12,
    color: "#4B5563",
    fontWeight: "500",
  },

  createdDate: {
    fontSize: 11,
    color: "#9CA3AF",
  },
});

const STATUS_STYLES: Record<Task["status"], any> = {
  Completed: styles.completedStatus,
  "In Progress": styles.inProgressStatus,
  New: styles.newStatus,
};

export default TaskListItem;
