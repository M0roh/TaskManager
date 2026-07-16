import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import Location from "../types/location";
import { LogActionType, LogItem } from "../types/logItem";
import Task from "../types/task";
import {
  cancelTaskNotification,
  scheduleTaskNotification,
} from "../utils/notificationHelper";

interface TaskState {
  tasks: Task[];
  logs: LogItem[];

  addLog: (actionType: LogActionType, description: string) => void;

  addTask: (
    title: string,
    description: string,
    deadline: Date,
    taskLocation: Location,
    attachments: string[],
  ) => void;
  editTask: (
    id: string,
    title: string,
    description: string,
    deadline: Date,
    taskLocation: Location,
    attachments: string[],
  ) => void;
  updateTaskStatus: (id: string, status: Task["status"]) => void;
  deleteTask: (id: string) => void;
  clearTasks: () => void;

  syncTasks: () => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      logs: [],

      addLog: (actionType, description) =>
        set((state) => ({
          logs: [
            {
              id:
                Date.now().toString() + Math.random().toString(36).substr(2, 9),
              timestamp: new Date().toISOString(),
              actionType,
              description,
            },
            ...state.logs,
          ],
        })),

      addTask: async (
        title,
        description,
        deadline,
        taskLocation,
        attachments,
      ) => {
        const notificationId = await scheduleTaskNotification(title, deadline);

        const newTask: Task = {
          id: Crypto.randomUUID(),

          title,
          description,
          status: "New",

          location: taskLocation,
          attachments,

          createdDate: new Date().toISOString(),
          deadline: deadline.toISOString(),

          syncStatus: false,
          notificationId: notificationId || undefined,
        };

        get().addLog("CREATE", `Created task "${title}"`);

        set((state) => ({
          tasks: [newTask, ...state.tasks],
        }));
      },

      editTask: async (
        id,
        title,
        description,
        deadline,
        taskLocation,
        attachments,
      ) => {
        const task = get().tasks.find((t) => t.id === id);
        if (!task) return;
        const hasAttachmentChanged =
          JSON.stringify(task?.attachments) !== JSON.stringify(attachments);

        const taskTime = new Date(task.deadline).getTime();
        if (deadline && taskTime !== deadline.getTime()) {
          await cancelTaskNotification(task.notificationId);
          await scheduleTaskNotification(task.title, deadline);
        }

        if (hasAttachmentChanged) {
          get().addLog(
            "ATTACHMENT_CHANGE",
            `Updated attachments for task "${title}"`,
          );
        }
        get().addLog("EDIT", `Edited task "${title}"`);

        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  title,
                  description,
                  location: taskLocation,
                  attachments,
                  deadline: deadline.toISOString(),
                  syncStatus: false,
                }
              : task,
          ),
        }));
      },

      updateTaskStatus: async (id, status) => {
        const task = get().tasks.find((t) => t.id === id);

        if (task && (status === "Completed" || status === "Canceled")) {
          await cancelTaskNotification(task.notificationId);
        }

        get().addLog(
          "STATUS_CHANGE",
          `Status task "${task?.title}" changed from ${task?.status} to ${status}`,
        );

        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, status, syncStatus: false } : task,
          ),
        }));
      },

      deleteTask: async (id) => {
        const taskToDelete = get().tasks.find((t) => t.id === id);
        if (taskToDelete?.notificationId) {
          await cancelTaskNotification(taskToDelete.notificationId);
        }

        get().addLog("DELETE", `Deleted task "${taskToDelete?.title}"`);

        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },

      clearTasks: () => set({ tasks: [] }),

      syncTasks: async () => {
        const SERVER_URL = "http://192.168.100.6:3000/tasks";

        const tasks = get().tasks;

        let localTasks = [...tasks];
        let hasChanges = false;

        for (let i = 0; i < localTasks.length; i++) {
          const task = localTasks[i];
          if (task.syncStatus) continue;

          try {
            const checkRes = await fetch(`${SERVER_URL}/${task.id}`);
            const exists = checkRes.status === 200;

            const response = await fetch(
              exists ? `${SERVER_URL}/${task.id}` : SERVER_URL,
              {
                method: exists ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  ...task,
                  id: task.id,
                  syncStatus: true,
                }),
              },
            );

            if (response.ok) {
              localTasks[i] = { ...task, syncStatus: true };
              hasChanges = true;
            } else {
              localTasks[i] = { ...task, syncStatus: false };
              hasChanges = true;
            }
          } catch (error) {
            console.log(`Push failed for task ${task.id}:`, error);
            localTasks[i] = { ...task, syncStatus: false };
            hasChanges = true;
          }
        }

        try {
          const pullResponse = await fetch(SERVER_URL);
          if (pullResponse.ok) {
            const serverTasks = await pullResponse.json();

            const mergedTasks = [...localTasks];

            serverTasks.forEach((sTask: Task) => {
              const localIndex = mergedTasks.findIndex(
                (t) => t.id === sTask.id,
              );

              if (localIndex === -1) {
                mergedTasks.push({
                  id: sTask.id,
                  title: sTask.title,
                  description: sTask.description,
                  createdDate: sTask.createdDate,
                  deadline: sTask.deadline,
                  location: sTask.location,
                  attachments: sTask.attachments || [],
                  status: sTask.status,
                  syncStatus: true,
                });
                hasChanges = true;
              } else {
                const localTask = mergedTasks[localIndex];
                if (localTask.syncStatus) {
                  mergedTasks[localIndex] = {
                    ...localTask,
                    title: sTask.title,
                    description: sTask.description,
                    deadline: sTask.deadline,
                    location: sTask.location,
                    attachments: sTask.attachments || [],
                    status: sTask.status,
                    syncStatus: true,
                  };
                  hasChanges = true;
                }
              }
            });

            if (hasChanges) {
              set({ tasks: mergedTasks });
              get().addLog(
                "SYNC",
                "Sync completed: pushed local updates and pulled server changes.",
              );
            }
          }
        } catch (pullError) {
          console.log("Pull from server failed:", pullError);
          if (hasChanges) {
            set({ tasks: localTasks });
          }
          get().addLog(
            "SYNC",
            "Sync partially failed (Offline mode or Server unreachable)",
          );
        }
      },
    }),

    {
      name: "task-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
