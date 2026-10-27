export type NotificationType =
  | "course"
  | "playground"
  | "book"
  | "system";

export interface Notification {
  id: number;
  title: string;
  description: string;
  type: NotificationType;
  time: string;
  read: boolean;
  href?: string;
}