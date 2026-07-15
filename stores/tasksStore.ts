import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import Task from "../types/task";

interface TaskState {
  tasks: Task[];

  addTask: (title: string, description: string, dueDate: Date) => void;
  updateTaskStatus: (id: string, status: Task["status"]) => void;
  deleteTask: (id: string) => void;
  clearTasks: () => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],

      addTask: (title, description, dueDate) =>
        set((state) => {
          const newTask: Task = {
            taskId: Crypto.randomUUID(),

            title,
            description,
            status: "New",

            createdDate: new Date().toISOString(),
            dueDate: dueDate.toISOString(),

            syncStatus: false,
          };
          return { tasks: [newTask, ...state.tasks] };
        }),

      updateTaskStatus: (id, status) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.taskId === id ? { ...task, status, syncStatus: false } : task,
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.taskId !== id),
        })),

      clearTasks: () => set({ tasks: [] }),
    }),

    {
      name: "task-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
