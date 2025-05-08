export interface Post {
  incident_id: number;
  content: string;
  created_at: string;
  display_name: string;
  total_upvotes: number;
  total_downvotes: number;
  total_comments: number;
  user_id: number;
  is_upvoted: boolean;
  is_downvoted: boolean;
}

export interface Vote {
  incident_id: number;
  is_upvoted: number;
  is_downvoted: number;
}
