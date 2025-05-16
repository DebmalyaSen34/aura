export interface BasicPost {
  incident_id: number;
  content: string;
  created_at: string;
  total_upvotes: number;
  total_downvotes: number;
  total_comments: number;
  name: string; // Author's name
  username?: string; // Author's username
  display_name?: string; // Author's display name
}

export interface Post extends BasicPost {
  user_id?: number;
  is_upvoted: boolean;
  is_downvoted: boolean;
  upvotes: number;
  downvotes: number;
  profile_image?: string;
}

export interface Vote {
  incident_id: number;
  upvotes: number;
  downvotes: number;
}
