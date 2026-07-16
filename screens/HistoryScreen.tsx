import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useTaskStore } from "../stores/tasksStore";
import { LogActionType } from "../types/logItem";

export default function HistoryScreen() {
  const logs = useTaskStore((state) => state.logs) || [];

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No actions logged yet.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.logCard}>
            <View style={styles.logHeader}>
              <Text style={[styles.badge, ACTION_STYLES[item.actionType]]}>
                {item.actionType}
              </Text>
              <Text style={styles.time}>{formatTime(item.timestamp)}</Text>
            </View>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 10 },
  emptyText: { textAlign: "center", marginTop: 40, color: "#888" },
  logCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  logHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  badge: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#fff",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  time: { fontSize: 11, color: "#666" },
  description: { fontSize: 14, color: "#333" },

  createAction: { backgroundColor: "#4CAF50" },
  editAction: { backgroundColor: "#2196F3" },
  statusChangeAction: { backgroundColor: "#FF9800" },
  attachmentChangeAction: { backgroundColor: "#9C27B0" },
  deleteAction: { backgroundColor: "#F44336" },
  syncAction: { backgroundColor: "#00BCD4" },
});

const ACTION_STYLES: Record<LogActionType, any> = {
  CREATE: styles.createAction,
  EDIT: styles.editAction,
  STATUS_CHANGE: styles.statusChangeAction,
  ATTACHMENT_CHANGE: styles.attachmentChangeAction,
  DELETE: styles.deleteAction,
  SYNC: styles.syncAction,
};
