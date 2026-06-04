import React, { useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Collapse,
  CircularProgress,
  Tooltip,

} from "@mui/material";
import {
  SendRounded,
  DeleteOutline,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { addCommentApi, deleteCommentApi } from "../../api/services";
import UserAvatar from "../common/UserAvatar";
import { timeAgo, getErrorMessage } from "../../utils/helpers";

/**
 * CommentSection
 * Inline expandable comment list with add/delete functionality
 *
 * @param {string} postId
 * @param {Array} initialComments
 * @param {function} onCommentsUpdate - Called with updated comments array
 * @param {boolean} expanded - Whether section is open
 * @param {function} onToggle
 */
const CommentSection = ({
  postId,
  initialComments = [],
  onCommentsUpdate,
  expanded,
  onToggle,
}) => {
  const { user } = useAuth();
  const [comments, setComments] = useState(initialComments);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const PREVIEW_COUNT = 2; // Show 2 comments collapsed; "see all" when expanded

  /**
   * Submit a new comment
   */
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setSubmitting(true);
    setError("");
    try {
      const data = await addCommentApi(postId, text.trim());
      const updated = [...comments, data.data.comment];
      setComments(updated);
      onCommentsUpdate(updated);
      setText("");
    } catch (err) {
      setError(getErrorMessage(err, "Failed to post comment"));
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Delete a comment
   */
  const handleDeleteComment = async (commentId) => {
    setDeletingId(commentId);
    try {
      await deleteCommentApi(postId, commentId);
      const updated = comments.filter((c) => c._id !== commentId);
      setComments(updated);
      onCommentsUpdate(updated);
    } catch (err) {
      console.error("Delete comment error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const visibleComments = expanded ? comments : comments.slice(-PREVIEW_COUNT);

  return (
    <Box>
      {/* Comment count toggle */}
      {comments.length > 0 && (
        <Box
          display="flex"
          alignItems="center"
          gap={0.5}
          sx={{ cursor: "pointer", mb: 1 }}
          onClick={onToggle}
        >
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            {expanded
              ? "Hide comments"
              : comments.length > PREVIEW_COUNT
              ? `View all ${comments.length} comments`
              : `${comments.length} comment${comments.length !== 1 ? "s" : ""}`}
          </Typography>
          {expanded ? (
            <KeyboardArrowUp fontSize="small" sx={{ color: "text.secondary", fontSize: 16 }} />
          ) : (
            <KeyboardArrowDown fontSize="small" sx={{ color: "text.secondary", fontSize: 16 }} />
          )}
        </Box>
      )}

      {/* Comments list */}
      <Collapse in={expanded || comments.length <= PREVIEW_COUNT}>
        <Box display="flex" flexDirection="column" gap={1} mb={1.5}>
          {visibleComments.map((comment) => (
            <Box
              key={comment._id}
              display="flex"
              alignItems="flex-start"
              gap={1}
              sx={{
                animation: "fadeIn 0.2s ease",
                "@keyframes fadeIn": {
                  from: { opacity: 0, transform: "translateY(4px)" },
                  to: { opacity: 1, transform: "translateY(0)" },
                },
              }}
            >
              <UserAvatar username={comment.username} size={28} />
              <Box
                flexGrow={1}
                sx={{
                  bgcolor: "grey.50",
                  borderRadius: "0 12px 12px 12px",
                  px: 1.5,
                  py: 1,
                  position: "relative",
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={0.25}>
                  <Typography variant="caption" fontWeight={700} color="text.primary">
                    @{comment.username}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    · {timeAgo(comment.createdAt)}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.5 }}>
                  {comment.text}
                </Typography>
              </Box>

              {/* Delete button for comment author or post author */}
              {(comment.user === user?._id ||
                comment.username === user?.username) && (
                <Tooltip title="Delete comment">
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteComment(comment._id)}
                    disabled={deletingId === comment._id}
                    sx={{
                      p: 0.5,
                      opacity: 0.5,
                      "&:hover": { opacity: 1, color: "error.main" },
                    }}
                  >
                    {deletingId === comment._id ? (
                      <CircularProgress size={14} />
                    ) : (
                      <DeleteOutline fontSize="small" />
                    )}
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          ))}
        </Box>
      </Collapse>

      {/* Error */}
      {error && (
        <Typography variant="caption" color="error" sx={{ display: "block", mb: 1 }}>
          {error}
        </Typography>
      )}

      {/* Comment input */}
      <Box
        component="form"
        onSubmit={handleAddComment}
        display="flex"
        alignItems="center"
        gap={1}
      >
        <UserAvatar username={user?.username} size={30} />
        <TextField
          fullWidth
          size="small"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleAddComment(e);
            }
          }}
          inputProps={{ maxLength: 500 }}
          disabled={submitting}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px",
              bgcolor: "grey.50",
              "& fieldset": { border: "1px solid", borderColor: "divider" },
              "&:hover fieldset": { borderColor: "primary.light" },
              "&.Mui-focused fieldset": { borderColor: "primary.main" },
            },
          }}
        />
        <IconButton
          type="submit"
          size="small"
          disabled={!text.trim() || submitting}
          sx={{
            bgcolor: text.trim() ? "primary.main" : "grey.200",
            color: text.trim() ? "white" : "text.secondary",
            transition: "all 0.2s",
            "&:hover": {
              bgcolor: text.trim() ? "primary.dark" : "grey.300",
            },
            "&:disabled": { bgcolor: "grey.200", color: "text.secondary" },
          }}
        >
          {submitting ? (
            <CircularProgress size={16} sx={{ color: "white" }} />
          ) : (
            <SendRounded fontSize="small" />
          )}
        </IconButton>
      </Box>
    </Box>
  );
};

export default CommentSection;
