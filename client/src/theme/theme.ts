import { createTheme } from "@mui/material/styles";
import { ThemeOptions } from "@mui/material/styles";

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: "#1C4670",
    },
    secondary: {
      main: "#278AB0",
    },
    success: {
      main: "#1DC690",
    },
    error: {
      main: "#D64545",
    },
    info: {
      main: "#BAB2B5",
    },

    background: {
      default: "#EAEAE0",
      paper: "#1C4670",
    },
  },
  typography: {
    fontFamily: "Bricolage Grotesque, sans-serif",
    fontSize: 18,
    h1: {
      fontFamily: "Bricolage Grotesque, serif",
    },
    h2: {
      fontFamily: "Bricolage Grotesque, serif",
    },
    h3: {
      fontFamily: "Bricolage Grotesque, serif",
    },
    h4: {
      fontFamily: "Bricolage Grotesque, serif",
    },
    h5: {
      fontFamily: "Bricolage Grotesque, serif",
    },
    h6: {
      fontFamily: "Bricolage Grotesque, serif",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "white",
            },
            "&:hover fieldset": {
              borderColor: "white",
            },
            "&.Mui-focused fieldset": {
              borderColor: "white",
            },
          },
          "& .MuiInputLabel-root": {
            color: "white",
          },
          "& .MuiOutlinedInput-input": {
            color: "white",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "white",
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "white",
          "&.Mui-checked": {
            color: "white",
          },
          "& .MuiSvgIcon-root": {
            fontSize: 24,
            color: "white",
          },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          color: "white",
        },
      },
    },
  },
};

const theme = createTheme(themeOptions);
export default theme;
