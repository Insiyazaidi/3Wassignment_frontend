import React from "react";
import { Box, Container, Typography, Chip } from "@mui/material";
import { PeopleAltOutlined } from "@mui/icons-material";
import Feed from "../components/feed/Feed";
import { useAuth } from "../context/AuthContext";

/**
 * HomePage
 * Main page — shows the social feed
 */
const HomePage = () => {
  const { user } = useAuth();

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pb: 8 }}>
      <Container maxWidth="sm" sx={{ pt: 3, px: { xs: 1.5, sm: 2 } }}>
        {/* Page header */}
        <Box mb={3}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h5" fontWeight={800} color="text.primary">
                Social Feed
              </Typography>
              <Typography variant="body2" color="text.secondary">
                What's happening in the community
              </Typography>
            </Box>
            <Chip
              icon={<PeopleAltOutlined fontSize="small" />}
              label={`@${user?.username}`}
              variant="outlined"
              color="primary"
              size="small"
              sx={{ borderRadius: 2, fontWeight: 600 }}
            />
          </Box>
        </Box>

        {/* Feed */}
        <Feed />
      </Container>
    </Box>
  );
};

export default HomePage;
