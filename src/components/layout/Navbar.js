import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Divider,
  ListItemIcon,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Logout as LogoutIcon,
  AccountCircle as AccountIcon,
  AutoAwesome as SparkleIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { stringToColor, getInitials } from "../../utils/helpers";

/**
 * Navbar
 * Top app bar with branding, user menu, and logout
 */
const Navbar = () => {
  const { user, logoutUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleOpenMenu = (e) => setAnchorEl(e.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleLogout = () => {
    handleCloseMenu();
    logoutUser();
    navigate("/login");
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid",
        borderColor: "divider",
        color: "text.primary",
      }}
    >
      <Toolbar sx={{ maxWidth: 700, width: "100%", mx: "auto", px: { xs: 2, sm: 3 } }}>
        {/* Brand */}
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          sx={{ cursor: "pointer", flexGrow: 1 }}
          onClick={() => navigate("/")}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 2,
              background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SparkleIcon sx={{ color: "white", fontSize: 18 }} />
          </Box>
          {!isMobile && (
            <Typography
              variant="h6"
              fontWeight={800}
              sx={{
                background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              SocialSpace
            </Typography>
          )}
        </Box>

        {/* Right section */}
        {isAuthenticated ? (
          <Box display="flex" alignItems="center" gap={1}>
            <Typography
              variant="body2"
              fontWeight={600}
              color="text.secondary"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              @{user?.username}
            </Typography>
            <Tooltip title="Account menu">
              <IconButton onClick={handleOpenMenu} size="small" sx={{ p: 0.5 }}>
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: stringToColor(user?.username || ""),
                    fontSize: 14,
                    fontWeight: 700,
                    border: "2px solid",
                    borderColor: "primary.main",
                  }}
                >
                  {getInitials(user?.username || "")}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleCloseMenu}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              PaperProps={{
                elevation: 3,
                sx: { mt: 1, minWidth: 200, borderRadius: 2 },
              }}
            >
              <Box px={2} py={1.5}>
                <Typography variant="subtitle2" fontWeight={700}>
                  {user?.username}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={handleCloseMenu} dense>
                <ListItemIcon>
                  <AccountIcon fontSize="small" />
                </ListItemIcon>
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout} dense sx={{ color: "error.main" }}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" sx={{ color: "error.main" }} />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate("/login")}
              sx={{ borderRadius: 2 }}
            >
              Login
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => navigate("/signup")}
              sx={{ borderRadius: 2 }}
            >
              Sign Up
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
