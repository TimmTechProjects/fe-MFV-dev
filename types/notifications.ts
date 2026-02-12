export type NotificationType =
  | "post_like"
  | "post_comment"
  | "forum_reply"
  | "forum_vote"
  | "follow"
  | "mention"
  | "reminder"
  | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  linkUrl?: string;
  actor?: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
  createdAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
  page: number;
  totalPages: number;
}

export interface NotificationPreferences {
  emailLikes: boolean;
  emailComments: boolean;
  emailFollows: boolean;
  emailReminders: boolean;
  pushLikes: boolean;
  pushComments: boolean;
  pushFollows: boolean;
  pushReminders: boolean;
  inAppLikes: boolean;
  inAppComments: boolean;
  inAppFollows: boolean;
  inAppReminders: boolean;
}
