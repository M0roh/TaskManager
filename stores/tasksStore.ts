import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import Task from "../types/task";

interface TaskState {
  tasks: Task[];

  addTask: (title: string, description: string, dueDate: Date) => void;
  updateTaskStatus: (id: number, status: Task["status"]) => void;
  deleteTask: (id: number) => void;
  clearTasks: () => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [
        {
          taskId: 1,

          title: "Test task",
          description: "test task description",
          status: "New",

          createdDate: new Date().toISOString(),
          dueDate: new Date(2026, 7, 30).toISOString(),

          syncStatus: false,
        },
        {
          taskId: 2,

          title: "Test task 2",
          description: "test task 2 description",
          status: "In Progress",

          createdDate: new Date().toISOString(),
          dueDate: new Date(2026, 8, 16).toISOString(),

          syncStatus: false,
        },
      ],

      addTask: (title, description, dueDate) =>
        set((state) => {
          const newTask: Task = {
            taskId: 1,

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
