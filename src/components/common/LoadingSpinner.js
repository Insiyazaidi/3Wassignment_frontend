import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

/**
 * LoadingSpinner
 * Centered loading indicator with optional message
 */
const LoadingSpinner = ({ message = "Loading...", fullHeight = false }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={2}
      sx={{ minHeight: fullHeight ? "60vh" : "200px", width: "100%" }}
    >
      <CircularProgress
        size={36}
        thickness={4}
        sx={{ color: "primary.main" }}
      />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingSpinner;
