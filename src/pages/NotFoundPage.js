import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { HomeOutlined } from "@mui/icons-material";

/**
 * NotFoundPage - 404
 */
const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ bgcolor: "background.default", textAlign: "center", p: 3 }}
    >
      <Typography
        variant="h1"
        fontWeight={900}
        sx={{
          fontSize: { xs: "6rem", sm: "9rem" },
          background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          lineHeight: 1,
          mb: 2,
        }}
      >
        404
      </Typography>
      <Typography variant="h5" fontWeight={700} color="text.primary" mb={1}>
        Page not found
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4} maxWidth={400}>
        The page you're looking for doesn't exist or has been moved.
      </Typography>
      <Button
        variant="contained"
        startIcon={<HomeOutlined />}
        onClick={() => navigate("/")}
        size="large"
      >
        Back to Home
      </Button>
    </Box>
  );
};

export default NotFoundPage;
