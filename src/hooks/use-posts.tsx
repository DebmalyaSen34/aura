"use client";

import { useState, useEffect } from "react";
import type { Post, Vote } from "@/types/post-types";
import getAccessToken from "@/lib/getAcessToken";

export function usePosts() {
  const [isLoading, setIsLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [posts, setPosts] = useState<Post[]>([]);

  //* Fetch posts from the database
  // But before check if posts already exist in the cache
  // If they do, return them
  // If they don't, fetch them from the database
  // Then, save them to the cache
  // Then, return them
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const cachedPosts = localStorage.getItem("posts");
        if (cachedPosts && cachedPosts.length > 0) {
          console.log("Using cached posts");
          setPosts(JSON.parse(cachedPosts));
          setIsLoading(false);
          return;
        }

        const token = getAccessToken();
        if (!token) {
          console.error("No access token found");
          setPosts([]);
          setIsLoading(false);
          return;
        }

        console.log(
          "Fetching posts from:",
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/incidents/incident-home`
        );

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/incidents/incident-home`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            method: "GET",
          }
        );

        if (!response.ok) {
          console.error("API response not OK:", {
            status: response.status,
            statusText: response.statusText,
            url: response.url,
          });
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", {
          data,
          type: typeof data,
          isArray: Array.isArray(data),
          keys: data ? Object.keys(data) : null,
        });

        // Handle different response structures
        let postsData = [];
        if (Array.isArray(data)) {
          postsData = data;
        } else if (data && typeof data === "object") {
          // If data is an object, check for common response structures
          postsData = data.posts || data.data || data.items || [];
        }

        if (!Array.isArray(postsData)) {
          console.error("Could not extract posts array from response:", data);
          setPosts([]);
          return;
        }

        localStorage.setItem("posts", JSON.stringify(postsData));
        setPosts(postsData);
      } catch (error) {
        console.error("Error while fetching posts:", error);
        setPosts([]); // Set empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  //* Toggle upvotes and downvotes

  //* Upvote and Downvote logics:

  // 1. Check if the user has already voted for the post
  // 2. If they have, toggle the vote
  // 3. If they haven't, add their vote to the post
  // 4. Update the post in the database
  // 5. Update the post in the cache

  const toggleLike = async (
    postId: number,
    isUpvote: boolean = true,
    isDownvote: boolean = false
  ) => {
    // Get posts from local storage
    const cachedPosts = localStorage.getItem("posts");
    if (!cachedPosts) {
      console.error("No posts found in local storage");
      return;
    }

    const posts = JSON.parse(cachedPosts);
    const postIndex = posts.findIndex(
      (post: Post) => post.incident_id === postId
    );

    if (postIndex === -1) {
      console.error("Post not found in local storage");
      return;
    }

    const post: Post = posts[postIndex];
    const token = getAccessToken();

    if (!token) {
      console.error("No access token found");
      return;
    }

    // Calculate new vote state
    let newVoteState = {
      is_upvoted: post.is_upvoted,
      is_downvoted: post.is_downvoted,
      total_upvotes: post.total_upvotes,
      total_downvotes: post.total_downvotes,
    };

    if (isUpvote) {
      if (post.is_upvoted) {
        // Remove upvote
        newVoteState.is_upvoted = false;
        newVoteState.total_upvotes = Math.max(0, post.total_upvotes - 1);
      } else {
        // Add upvote
        newVoteState.is_upvoted = true;
        newVoteState.total_upvotes = post.total_upvotes + 1;
        // Remove downvote if exists
        if (post.is_downvoted) {
          newVoteState.is_downvoted = false;
          newVoteState.total_downvotes = Math.max(0, post.total_downvotes - 1);
        }
      }
    } else if (isDownvote) {
      if (post.is_downvoted) {
        // Remove downvote
        newVoteState.is_downvoted = false;
        newVoteState.total_downvotes = Math.max(0, post.total_downvotes - 1);
      } else {
        // Add downvote
        newVoteState.is_downvoted = true;
        newVoteState.total_downvotes = post.total_downvotes + 1;
        // Remove upvote if exists
        if (post.is_upvoted) {
          newVoteState.is_upvoted = false;
          newVoteState.total_upvotes = Math.max(0, post.total_upvotes - 1);
        }
      }
    }

    // Prepare vote object for API
    const vote = {
      incident_id: postId,
      is_upvoted: newVoteState.is_upvoted,
      is_downvoted: newVoteState.is_downvoted,
    };

    // Optimistically update UI
    posts[postIndex] = {
      ...post,
      ...newVoteState,
    };
    localStorage.setItem("posts", JSON.stringify(posts));
    setPosts(posts);

    // Call the API to update the vote
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/vote/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(vote),
        }
      );

      if (!response.ok) {
        console.error("Failed to update vote:", response);
        // Revert changes if API call fails
        posts[postIndex] = post;
        localStorage.setItem("posts", JSON.stringify(posts));
        setPosts(posts);
        return;
      }

      console.log("Vote updated successfully");
    } catch (error) {
      console.error("Error updating vote:", error);
      // Revert changes if API call fails
      posts[postIndex] = post;
      localStorage.setItem("posts", JSON.stringify(posts));
      setPosts(posts);
    }
  };

  return {
    posts,
    isLoading,
    likedPosts,
    toggleLike,
  };
}
