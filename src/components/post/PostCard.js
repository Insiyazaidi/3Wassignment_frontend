import React, { useState, memo } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Tooltip,
  Fade,
  Divider
 
} from "@mui/material";
import {
  FavoriteBorderRounded,
  FavoriteRounded,
  ChatBubbleOutlineRounded,
  MoreHorizRounded,
  DeleteOutline,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { toggleLikeApi, deletePostApi } from "../../api/services";
import UserAvatar from "../common/UserAvatar";
import CommentSection from "./CommentSection";
import { timeAgo, getErrorMessage } from "../../utils/helpers";

/**
 * PostCard
 * Displays a single post with like, comment, and delete functionality.
 * All UI updates are optimistic (instant, no refresh needed).
 *
 * @param {object} post - Post data object
 * @param {function} onDelete - Called with postId when post is deleted
 */
const PostCard = memo(({ post: initialPost, onDelete }) => {
  const { user } = useAuth();

  const [post, setPost] = useState(initialPost);
  const [likingInProgress, setLikingInProgress] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [commentsExpanded, setCommentsExpanded] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
 

  // Derived state
  const isLiked = post.likes?.some((l) => l.user === user?._id || l.username === user?.username);
  const isAuthor = post.author === user?._id || post.username === user?.username;
  const likesCount = post.likes?.length || 0;
  const commentsCount = post.comments?.length || 0;

  /**
   * Toggle like — optimistic update for instant UI response
   */
  const handleLike = async () => {
    if (likingInProgress) return;
    setLikingInProgress(true);

    // Optimistic update
    const optimisticLikes = isLiked
      ? post.likes.filter((l) => l.username !== user?.username)
      : [...(post.likes || []), { user: user?._id, username: user?.username }];

    setPost((prev) => ({ ...prev, likes: optimisticLikes }));

    try {
      const data = await toggleLikeApi(post._id);
      // Reconcile with server response
      setPost((prev) => ({ ...prev, likes: data.data.likes }));
    } catch (err) {
      // Revert on failure
      setPost((prev) => ({ ...prev, likes: post.likes }));
      console.error("Like toggle failed:", err);
    } finally {
      setLikingInProgress(false);
    }
  };

  /**
   * Delete post with confirmation
   */
  const handleDelete = async () => {
    setMenuAnchor(null);
    if (!window.confirm("Delete this post? This action cannot be undone.")) return;

    setDeleting(true);
    try {
      await deletePostApi(post._id);
      onDelete(post._id);
    } catch (err) {
      console.error("Delete failed:", err);
      alert(getErrorMessage(err, "Failed to delete post"));
    } finally {
      setDeleting(false);
    }
  };

  const handleCommentsUpdate = (updatedComments) => {
    setPost((prev) => ({ ...prev, comments: updatedComments }));
  };

  return (
    <Fade in timeout={300}>
      <Card
        sx={{
          borderRadius: 3,
          mb: 2,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          opacity: deleting ? 0.5 : 1,
          transition: "opacity 0.3s ease",
          "&:hover": {
            boxShadow: "0 4px 16px rgba(79,70,229,0.08)",
          },
        }}
      >
        <CardContent sx={{ pb: 1 }}>
          {/* Post header — avatar, username, timestamp, menu */}
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <UserAvatar username={post.username} size={42} showTooltip />
              <Box>
                <Typography variant="subtitle2" fontWeight={700} color="text.primary">
                  @{post.username}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {timeAgo(post.createdAt)}
                </Typography>
              </Box>
            </Box>

            {/* Post options menu (only for author) */}
            {isAuthor && (
              <Box>
                <Tooltip title="Options">
                  <IconButton
                    size="small"
                    onClick={(e) => setMenuAnchor(e.currentTarget)}
                    sx={{ color: "text.secondary" }}
                  >
                    <MoreHorizRounded />
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={menuAnchor}
                  open={Boolean(menuAnchor)}
                  onClose={() => setMenuAnchor(null)}
                  PaperProps={{
                    elevation: 3,
                    sx: { borderRadius: 2, minWidth: 160 },
                  }}
                >
                  <MenuItem
                    onClick={handleDelete}
                    dense
                    sx={{ color: "error.main" }}
                    disabled={deleting}
                  >
                    <ListItemIcon>
                      <DeleteOutline fontSize="small" sx={{ color: "error.main" }} />
                    </ListItemIcon>
                    Delete Post
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Box>

          {/* Post text content */}
          {post.content && (
            <Typography
              variant="body1"
              color="text.primary"
              sx={{ mb: post.image?.url ? 2 : 0, lineHeight: 1.65, whiteSpace: "pre-wrap" }}
            >
              {post.content}
            </Typography>
          )}
        </CardContent>

        {/* Post image */}
        {post.image?.url && (
          <Box
            sx={{
              px: 0,
              cursor: "pointer",
              overflow: "hidden",
              position: "relative",
              "&:hover img": { transform: "scale(1.01)" },
            }}
            onClick={() => setImageOpen(true)}
          >
            <Box
              component="img"
              src={post.image.url}
              alt="Post image"
              sx={{
                width: "100%",
                maxHeight: 400,
                objectFit: "cover",
                display: "block",
                transition: "transform 0.3s ease",
              }}
            />
          </Box>
        )}

        {/* Actions — Like and Comment */}
        <CardContent sx={{ pt: 1, pb: "12px !important" }}>
          <Box display="flex" alignItems="center" gap={0.5} mb={1}>
            {/* Like button */}
            <Tooltip title={isLiked ? "Unlike" : "Like"}>
              <IconButton
                size="small"
                onClick={handleLike}
                disabled={likingInProgress}
                sx={{
                  color: isLiked ? "error.main" : "text.secondary",
                  transition: "transform 0.15s ease, color 0.15s ease",
                  "&:hover": {
                    transform: "scale(1.15)",
                    color: isLiked ? "error.dark" : "error.main",
                  },
                  "&:active": { transform: "scale(0.9)" },
                }}
              >
                {isLiked ? (
                  <FavoriteRounded fontSize="small" />
                ) : (
                  <FavoriteBorderRounded fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
            <Typography
              variant="body2"
              color={isLiked ? "error.main" : "text.secondary"}
              fontWeight={isLiked ? 600 : 400}
              sx={{ minWidth: 20 }}
            >
              {likesCount > 0 ? likesCount : ""}
            </Typography>

            {/* Comment button */}
            <Tooltip title="Comment">
              <IconButton
                size="small"
                onClick={() => setCommentsExpanded((prev) => !prev)}
                sx={{
                  color: commentsExpanded ? "primary.main" : "text.secondary",
                  ml: 0.5,
                  transition: "transform 0.15s ease",
                  "&:hover": { transform: "scale(1.1)", color: "primary.main" },
                }}
              >
                <ChatBubbleOutlineRounded fontSize="small" />
              </IconButton>
            </Tooltip>
            <Typography
              variant="body2"
              color={commentsExpanded ? "primary.main" : "text.secondary"}
              sx={{ minWidth: 20 }}
            >
              {commentsCount > 0 ? commentsCount : ""}
            </Typography>

            {/* Likes display — who liked */}
            {likesCount > 0 && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ ml: 1, display: { xs: "none", sm: "block" } }}
              >
                {likesCount === 1
                  ? `${post.likes[0]?.username} liked this`
                  : `${post.likes[0]?.username} and ${likesCount - 1} other${
                      likesCount - 1 > 1 ? "s" : ""
                    } liked this`}
              </Typography>
            )}
          </Box>

          {/* Comment section */}
          {(commentsExpanded || commentsCount > 0) && (
            <>
              <Divider sx={{ mb: 1.5 }} />
              <CommentSection
                postId={post._id}
                initialComments={post.comments || []}
                onCommentsUpdate={handleCommentsUpdate}
                expanded={commentsExpanded}
                onToggle={() => setCommentsExpanded((prev) => !prev)}
              />
            </>
          )}
          {commentsCount === 0 && !commentsExpanded && (
            <CommentSection
              postId={post._id}
              initialComments={[]}
              onCommentsUpdate={handleCommentsUpdate}
              expanded={false}
              onToggle={() => setCommentsExpanded(true)}
            />
          )}
        </CardContent>
      </Card>
    </Fade>
  );
});

PostCard.displayName = "PostCard";
export default PostCard;
