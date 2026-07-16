import Location from "./location";

export default interface Task {
  taskId: string;

  title: string;
  description: string;
  status: "New" | "In Progress" | "Completed" | "Canceled";

  location: Location;
  attachments?: string[];

  createdDate: string;
  deadline: string;
  completedDate?: string;

  syncStatus: boolean;
  notificationId?: string;
}
