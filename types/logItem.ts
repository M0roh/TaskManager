export type LogActionType =
  | "CREATE"
  | "EDIT"
  | "STATUS_CHANGE"
  | "ATTACHMENT_CHANGE"
  | "DELETE"
  | "SYNC";

export interface LogItem {
  id: string;
  timestamp: string;
  actionType: LogActionType;
  description: string;
}
