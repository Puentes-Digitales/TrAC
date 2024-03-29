import { dbData } from "../";

export interface INotificationsData {
  id: number;
  email: string;
  content: object;
  parameters: string;
  counter: number;
  risks: string;
  date: Date;
}
export const NOTIFICATIONS_DATA_TABLE = "notifications_data";

export const NotificationsDataTable = () =>
  dbData<INotificationsData>(NOTIFICATIONS_DATA_TABLE);
