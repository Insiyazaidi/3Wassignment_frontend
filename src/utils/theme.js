import { createTheme } from "@mui/material/styles";

/**
 * Custom MUI Theme
 * Deep indigo + amber accent — professional social feed aesthetic
 * inspired by TaskPlanet's clean, vibrant UI
 */
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#4F46E5",       // Indigo
      light: "#7C3AED",
      dark: "#3730A3",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#F59E0B",       // Amber accent
      light: "#FCD34D",
      dark: "#D97706",
      contrastText: "#000000",
    },
    background: {
      default: "#F1F5F9",    // Slate-100
      paper: "#FFFFFF",
    },
    text: {
      primary: "#0F172A",    // Slate-900
      secondary: "#64748B",  // Slate-500
    },
    divider: "#E2E8F0",
    error: { main: "#EF4444" },
    success: { main: "#22C55E" },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Segoe UI", sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    body1: { fontSize: "0.95rem", lineHeight: 1.6 },
    body2: { fontSize: "0.85rem", lineHeight: 1.5 },
    caption: { fontSize: "0.75rem" },
    button: {
      fontWeight: 600,
      textTransform: "none",
      letterSpacing: 0.3,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    "none",
    "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
    "0 4px 6px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.04)",
    "0 10px 15px rgba(0,0,0,0.07), 0 4px 6px rgba(0,0,0,0.05)",
    "0 20px 25px rgba(0,0,0,0.08), 0 10px 10px rgba(0,0,0,0.04)",
    ...Array(20).fill("0 25px 50px rgba(0,0,0,0.12)"),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: "10px 24px",
          fontWeight: 600,
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #3730A3 0%, #5B21B6 100%)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          border: "1px solid #E2E8F0",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
            "&:hover fieldset": { borderColor: "#4F46E5" },
            "&.Mui-focused fieldset": { borderColor: "#4F46E5" },
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 700,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
  },
});

export default theme;
