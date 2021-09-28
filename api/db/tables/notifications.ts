import { dbConfig, dbData } from "../";

export interface INotificationsData {
  id: number;
  email: string;
  content: string;
  date: Date;
}
export const NOTIFICATIONS_DATA_TABLE = "notifications_data";

export const NotificationsDataTable = () =>
  dbData<INotificationsData>(NOTIFICATIONS_DATA_TABLE);

export interface IMessageContent {
  id: number;
  description: string;
  content: string;
}
export const MESSAGE_CONTENT_TABLE = "message_content";

export const MessageContentTable = () =>
  dbConfig<IMessageContent>(MESSAGE_CONTENT_TABLE);
