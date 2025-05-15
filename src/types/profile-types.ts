import { BasicPost, Post } from "./post-types";

export interface User {
  id: string;
  name: string;
  username?: string;
  bio?: string;
  profile_image?: string;
  cover_image?: string;
  created_at: string;
  incidents: number;
}

export interface Profile {
  user: User;
  incidents: Post[]; // Using Post instead of BasicPost since these would be the user's own posts with full details
}
