import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { RefreshRounded, AutoAwesome } from "@mui/icons-material";
import { getFeedApi } from "../../api/services";
import PostCard from "../post/PostCard";
import CreatePost from "../post/CreatePost";
import LoadingSpinner from "../common/LoadingSpinner";
import { getErrorMessage } from "../../utils/helpers";

const POSTS_PER_PAGE = 10;

/**
 * Feed
 * Main social feed: post composer + paginated list of all posts
 */
const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);   // Initial load
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  /**
   * Fetch a page of posts and append to state
   */
  const fetchPosts = useCallback(async (pageNum = 1, reset = false) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      setError("");

      const data = await getFeedApi(pageNum, POSTS_PER_PAGE);

      setPosts((prev) =>
        reset ? data.data : [...prev, ...data.data]
      );
      setHasMore(data.pagination.hasMore);
      setPage(pageNum);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load posts. Please try again."));
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchPosts(1, true);
  }, [fetchPosts]);

  /**
   * Prepend newly created post to feed without re-fetching
   */
  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  /**
   * Remove deleted post from feed
   */
  const handlePostDeleted = (postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  /**
   * Load next page
   */
  const handleLoadMore = () => {
    fetchPosts(page + 1);
  };

  /**
   * Refresh the entire feed
   */
  const handleRefresh = () => {
    fetchPosts(1, true);
  };

  return (
    <Box>
      {/* Create post composer */}
      <CreatePost onPostCreated={handlePostCreated} />

      {/* Loading state */}
      {loading && <LoadingSpinner message="Loading your feed..." />}

      {/* Error state */}
      {error && !loading && (
        <Alert
          severity="error"
          sx={{ borderRadius: 2, mb: 2 }}
          action={
            <Button size="small" onClick={handleRefresh}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Empty feed */}
      {!loading && !error && posts.length === 0 && (
        <Box
          textAlign="center"
          py={8}
          sx={{
            background: "white",
            borderRadius: 3,
            border: "1px dashed",
            borderColor: "primary.light",
          }}
        >
          <AutoAwesome
            sx={{ fontSize: 48, color: "primary.light", mb: 2 }}
          />
          <Typography variant="h6" fontWeight={700} color="text.secondary">
            No posts yet
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Be the first to share something!
          </Typography>
        </Box>
      )}

      {/* Posts list */}
      {!loading && posts.length > 0 && (
        <>
          {/* Refresh button */}
          <Box display="flex" justifyContent="center" mb={1.5}>
            <Button
              variant="text"
              size="small"
              startIcon={<RefreshRounded fontSize="small" />}
              onClick={handleRefresh}
              sx={{ color: "text.secondary", borderRadius: 2 }}
            >
              Refresh feed
            </Button>
          </Box>

          {/* Post cards */}
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onDelete={handlePostDeleted}
            />
          ))}

          {/* Load more / end of feed */}
          <Box textAlign="center" py={3}>
            {hasMore ? (
              <Button
                variant="outlined"
                onClick={handleLoadMore}
                disabled={loadingMore}
                startIcon={
                  loadingMore ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : null
                }
                sx={{ borderRadius: 3, px: 4 }}
              >
                {loadingMore ? "Loading..." : "Load More Posts"}
              </Button>
            ) : (
              <Typography variant="body2" color="text.secondary">
                🎉 You've caught up! No more posts.
              </Typography>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default Feed;
