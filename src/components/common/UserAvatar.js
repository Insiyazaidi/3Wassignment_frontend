import React from "react";
import { Avatar, Tooltip } from "@mui/material";
import { stringToColor, getInitials } from "../../utils/helpers";

/**
 * UserAvatar
 * Shows a profile avatar with initials and deterministic color.
 * Falls back to image URL if provided.
 *
 * @param {string} username
 * @param {string} [imageUrl] - Optional avatar image
 * @param {number} [size=40]
 * @param {boolean} [showTooltip=false]
 */
const UserAvatar = ({ username = "", imageUrl = "", size = 40, showTooltip = false }) => {
  const bgColor = stringToColor(username);
  const initials = getInitials(username);

  const avatar = (
    <Avatar
      src={imageUrl || undefined}
      sx={{
        width: size,
        height: size,
        bgcolor: bgColor,
        fontSize: size * 0.38,
        fontWeight: 700,
        border: "2px solid white",
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        cursor: "default",
        flexShrink: 0,
      }}
    >
      {!imageUrl && initials}
    </Avatar>
  );

  if (showTooltip) {
    return (
      <Tooltip title={`@${username}`} placement="top" arrow>
        {avatar}
      </Tooltip>
    );
  }

  return avatar;
};

export default UserAvatar;
