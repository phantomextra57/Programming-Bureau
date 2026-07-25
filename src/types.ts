export type UserRole = "student" | "teacher";

export interface User {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  avatarUrl: string;
  bannerUrl?: string;
  bio: string;
  skills: string[];
  subscribersCount: number;
  subscribedTeachers: string[]; // List of teacher IDs subscribed to
  completedChallenges?: number;
  solvedErrorsCount?: number;
}

export interface CodeFile {
  name: string;
  language: string;
  content: string;
  folder?: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl: string;
  authorRole: UserRole;
  content: string;
  type: "general" | "error" | "tutorial";
  language?: string; // Language tag: Javascript, Python, HTML, CSS, React
  codeSnippet?: {
    code: string;
    language: string;
    filename?: string;
  };
  likes: string[]; // List of user IDs who liked the post
  comments: Comment[];
  isSolved?: boolean; // Only for "error" posts
  solvedByCommentId?: string; // ID of the comment that solved the error
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl: string;
  authorRole: UserRole;
  content: string;
  codeSnippet?: {
    code: string;
    language: string;
  };
  isSolution?: boolean; // Marked as a solution for "error" posts
  likes: string[]; // List of user IDs who liked this comment
  createdAt: string;
}

export interface TeacherChannelPost {
  id: string;
  teacherId: string;
  title: string;
  content: string;
  codeSnippet?: {
    code: string;
    language: string;
  };
  videoUrl?: string; // Simulated video link/lecture
  createdAt: string;
}

export type NotificationType = "like" | "comment" | "solution" | "system" | "broadcast" | "ai_completion";

export interface AppNotification {
  id: string;
  userId: string; // Target user
  senderName: string;
  senderAvatarUrl: string;
  type: NotificationType;
  title: string;
  message: string;
  linkTab: "feed" | "ide" | "teachers" | "profile";
  read: boolean;
  createdAt: string;
}

