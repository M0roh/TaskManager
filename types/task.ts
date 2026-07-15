import Location from "./location";

export default interface Task {
  taskId: string;

  title: string;
  description: string;
  status: "New" | "In Progress" | "Completed";

  location?: Location;

  createdDate: string;
  deadline: string;
  completedDate?: string;

  syncStatus: boolean;
}
