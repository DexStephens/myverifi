import { createTheme } from "@mui/material/styles";
import { ThemeOptions } from "@mui/material/styles";

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: "#1C4670",
    },
    secondary: {
      main: "#278AB0",
      light: "#31aede",
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
        root: ({ theme, ownerState }) => ({
          ...(ownerState.className?.includes("search-field") && {
            "& .MuiOutlinedInput-root": {
              backgroundColor: "white",
              "& fieldset": {
                borderColor: theme.palette.secondary.main,
              },
              "&:hover fieldset": {
                borderColor: theme.palette.success.main,
              },
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.success.main,
              },
            },
            "& .MuiInputBase-input::placeholder": {
              color: theme.palette.secondary.main,
              opacity: 1,
            },
            "& .MuiIconButton-root": {
              color: theme.palette.secondary.main,
              "&:hover": {
                color: theme.palette.success.main,
              },
            },
          }),
          ...(!ownerState.className?.includes("search-field") && {
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "white",
              },
              "&:hover fieldset": {
                borderColor: theme.palette.success.main,
              },
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.success.main,
              },
            },
            "& .MuiInputLabel-root": {
              color: "white",
              "&.Mui-focused": {
                color: theme.palette.success.main,
              },
            },
            "& .MuiOutlinedInput-input": {
              color: "white",
            },
          }),
        }),
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
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "white",
          "&.Mui-focused": {
            color: "white",
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          color: "white",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
          },
          "& .MuiSvgIcon-root": {
            color: "white",
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          "& .MuiSvgIcon-root": {
            color: "white",
          },
        },
        paper: {
          backgroundColor: "primary.main",
          "& .MuiAutocomplete-option": {
            color: "white",
          },
          "& .MuiAutocomplete-option[aria-selected='true']": {
            backgroundColor: "secondary.main",
          },
          "& .MuiAutocomplete-option.Mui-focused": {
            backgroundColor: "secondary.main",
          },
        },
      },
    },
  },
};

const theme = createTheme(themeOptions);
export default theme;
