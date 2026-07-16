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
  ) => void;
  editTask: (
    id: string,
    title: string,
    description: string,
    deadline: Date,
    taskLocation: Location,
  ) => void;
  updateTaskStatus: (id: string, status: Task["status"]) => void;
  deleteTask: (id: string) => void;
  clearTasks: () => void;
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

      addTask: async (title, description, deadline, taskLocation) => {
        const notificationId = await scheduleTaskNotification(title, deadline);

        const newTask: Task = {
          taskId: Crypto.randomUUID(),

          title,
          description,
          status: "New",

          location: taskLocation,

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

      editTask: async (id, title, description, deadline, taskLocation) => {
        const task = get().tasks.find((t) => t.taskId === id);
        if (!task) return;

        const taskTime = new Date(task.deadline).getTime();
        if (deadline && taskTime !== deadline.getTime()) {
          await cancelTaskNotification(task.notificationId);
          await scheduleTaskNotification(task.title, deadline);
        }

        get().addLog("EDIT", `Edited task "${title}"`);

        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.taskId === id
              ? {
                  ...task,
                  title,
                  description,
                  location: taskLocation,
                  deadline: deadline.toISOString(),
                  syncStatus: false,
                }
              : task,
          ),
        }));
      },

      updateTaskStatus: async (id, status) => {
        const task = get().tasks.find((t) => t.taskId === id);

        if (task && (status === "Completed" || status === "Canceled")) {
          await cancelTaskNotification(task.notificationId);
        }

        get().addLog(
          "STATUS_CHANGE",
          `Status task "${task?.title}" changed from ${task?.status} to ${status}`,
        );

        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.taskId === id ? { ...task, status, syncStatus: false } : task,
          ),
        }));
      },

      deleteTask: async (id) => {
        const taskToDelete = get().tasks.find((t) => t.taskId === id);
        if (taskToDelete?.notificationId) {
          await cancelTaskNotification(taskToDelete.notificationId);
        }

        get().addLog("DELETE", `Deleted task "${taskToDelete?.title}"`);

        set((state) => ({
          tasks: state.tasks.filter((task) => task.taskId !== id),
        }));
      },

      clearTasks: () => set({ tasks: [] }),
    }),

    {
      name: "task-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
