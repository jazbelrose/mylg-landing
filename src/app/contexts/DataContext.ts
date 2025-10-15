import React from "react";

export type Role = "admin" | "designer" | "builder" | "vendor" | "client" | string;

export interface UserLite {
  userId: string;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: Role;
  occupation?: string;
  messages?: Message[];
  pending?: boolean;
  thumbnail?: string;
  thumbnailUrl?: string;
  phoneNumber?: string;
  company?: string;
  collaborators?: string[];
  projects?: string[];
  [key: string]: unknown;
}

export interface TeamMember {
  userId: string;
  role?: Role;
  [k: string]: unknown;
}

export interface TimelineEvent {
  id?: string;
  title?: string;
  date?: string;
  timestamp?: string;
  [k: string]: unknown;
}

export interface QuickLink {
  id?: string;
  title?: string;
  url?: string;
  [k: string]: unknown;
}

export interface Project {
  projectId: string;
  title?: string;
  status?: string;
  team?: TeamMember[];
  timelineEvents?: TimelineEvent[];
  thumbnails?: string[];
  description?: string;
  color?: string;
  finishline?: string;
  productionStart?: string;
  dateCreated?: string;
  invoiceBrandName?: string;
  invoiceBrandAddress?: string;
  invoiceBrandPhone?: string;
  clientName?: string;
  clientAddress?: string;
  clientPhone?: string;
  clientEmail?: string;
  previewUrl?: string;
  quickLinks?: QuickLink[];
  [k: string]: unknown;
}

export interface Message {
  messageId?: string;
  optimisticId?: string;
  text?: string;
  body?: string;
  content?: string;
  timestamp?: string;
  reactions?: Record<string, string[]>;
  [k: string]: unknown;
}

export interface Thread {
  conversationId: string;
  otherUserId: string;
  lastMsgTs: string;
  snippet?: string;
  read?: boolean;
}

export interface LandingDataValue {
  opacity: number;
  setOpacity: React.Dispatch<React.SetStateAction<number>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DataContext = React.createContext<LandingDataValue | undefined>(undefined);