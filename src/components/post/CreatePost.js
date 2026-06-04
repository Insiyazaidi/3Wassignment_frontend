import React, { useState, useRef } from "react";
import {
  Card,
  CardContent,
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Collapse,
  Chip,
} from "@mui/material";
import {
  ImageOutlined,
  CloseRounded,
  SendRounded,
  AddPhotoAlternate,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { createPostApi } from "../../api/services";
import UserAvatar from "../common/UserAvatar";
import { getErrorMessage } from "../../utils/helpers";

/**
 * CreatePost
 * Post composer card — accepts text and/or image
 * @param {function} onPostCreated - Called with the new post object after creation
 */
const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();

  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);       // File object
  const [preview, setPreview] = useState("");      // Data URL for preview
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);

  const fileInputRef = useRef(null);

  const hasContent = content.trim().length > 0 || !!image;
  const charLimit = 2000;
  const charCount = content.length;
  const isNearLimit = charCount > charLimit * 0.85;

  /**
   * Handle image file selection — validate type/size and generate preview
   */
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, PNG, GIF, and WEBP images are allowed");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be under 10MB");
      return;
    }

    setImage(file);
    setError("");
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
    setPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!hasContent) {
      setError("Please add some text or an image before posting");
      return;
    }
    if (charCount > charLimit) {
      setError(`Content exceeds ${charLimit} character limit`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Use FormData to send multipart/form-data (required for file upload)
      const formData = new FormData();
      if (content.trim()) formData.append("content", content.trim());
      if (image) formData.append("image", image);

      const data = await createPostApi(formData);
      onPostCreated(data.data);

      // Reset form
      setContent("");
      setImage(null);
      setPreview("");
      setExpanded(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError(getErrorMessage(err, "Failed to create post. Try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        mb: 2,
        border: "1px solid",
        borderColor: expanded ? "primary.main" : "divider",
        transition: "border-color 0.2s ease",
        boxShadow: expanded ? "0 4px 20px rgba(79,70,229,0.1)" : "none",
      }}
    >
      <CardContent sx={{ pb: "16px !important" }}>
        <Box display="flex" gap={1.5} alignItems="flex-start">
          <UserAvatar username={user?.username} size={42} />

          <Box flexGrow={1}>
            {/* Text input */}
            <TextField
              fullWidth
              multiline
              minRows={expanded ? 3 : 1}
              maxRows={8}
              placeholder={`What's on your mind, ${user?.username}?`}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (error) setError("");
              }}
              onFocus={() => setExpanded(true)}
              variant="outlined"
              InputProps={{
                sx: {
                  borderRadius: 3,
                  fontSize: "0.95rem",
                  "& fieldset": {
                    border: "1.5px solid",
                    borderColor: expanded ? "primary.light" : "divider",
                  },
                },
              }}
            />

            {/* Character counter */}
            {expanded && (
              <Box display="flex" justifyContent="flex-end" mt={0.5}>
                <Typography
                  variant="caption"
                  color={charCount > charLimit ? "error" : isNearLimit ? "warning.main" : "text.secondary"}
                >
                  {charCount}/{charLimit}
                </Typography>
              </Box>
            )}

            {/* Image preview */}
            <Collapse in={!!preview}>
              {preview && (
                <Box
                  mt={1.5}
                  position="relative"
                  display="inline-block"
                  sx={{ maxWidth: "100%" }}
                >
                  <Box
                    component="img"
                    src={preview}
                    alt="Upload preview"
                    sx={{
                      maxWidth: "100%",
                      maxHeight: 300,
                      borderRadius: 2,
                      objectFit: "cover",
                      border: "1px solid",
                      borderColor: "divider",
                      display: "block",
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={removeImage}
                    sx={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      bgcolor: "rgba(0,0,0,0.6)",
                      color: "white",
                      "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                    }}
                  >
                    <CloseRounded fontSize="small" />
                  </IconButton>
                  <Chip
                    label={image?.name}
                    size="small"
                    sx={{
                      position: "absolute",
                      bottom: 6,
                      left: 6,
                      bgcolor: "rgba(0,0,0,0.6)",
                      color: "white",
                      fontSize: "0.7rem",
                      maxWidth: "80%",
                    }}
                  />
                </Box>
              )}
            </Collapse>

            {/* Error */}
            <Collapse in={!!error}>
              <Alert severity="error" sx={{ mt: 1, borderRadius: 2, py: 0 }}>
                {error}
              </Alert>
            </Collapse>

            {/* Actions row — shown when expanded */}
            <Collapse in={expanded}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mt={2}
              >
                {/* Left: Image upload */}
                <Box display="flex" gap={1} alignItems="center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    style={{ display: "none" }}
                    onChange={handleImageSelect}
                  />
                  <Tooltip title="Add image">
                    <IconButton
                      size="small"
                      onClick={() => fileInputRef.current?.click()}
                      sx={{
                        color: image ? "primary.main" : "text.secondary",
                        "&:hover": { color: "primary.main", bgcolor: "primary.50" },
                      }}
                    >
                      {image ? (
                        <ImageOutlined />
                      ) : (
                        <AddPhotoAlternate />
                      )}
                    </IconButton>
                  </Tooltip>
                  <Typography variant="caption" color="text.secondary">
                    JPG, PNG, GIF, WEBP · max 10MB
                  </Typography>
                </Box>

                {/* Right: Cancel + Post */}
                <Box display="flex" gap={1}>
                  <Button
                    size="small"
                    onClick={() => {
                      setExpanded(false);
                      setContent("");
                      removeImage();
                      setError("");
                    }}
                    sx={{ borderRadius: 2, color: "text.secondary" }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleSubmit}
                    disabled={loading || !hasContent || charCount > charLimit}
                    endIcon={
                      loading ? (
                        <CircularProgress size={14} color="inherit" />
                      ) : (
                        <SendRounded fontSize="small" />
                      )
                    }
                    sx={{ borderRadius: 2, px: 2.5 }}
                  >
                    {loading ? "Posting..." : "Post"}
                  </Button>
                </Box>
              </Box>
            </Collapse>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
