export default interface Task {
  taskId: number;

  title: string;
  description: string;
  status: "New" | "In Progress" | "Completed";

  location?: Location;

  createdDate: string;
  dueDate: string;
  completedDate?: string;

  syncStatus: boolean;
}
