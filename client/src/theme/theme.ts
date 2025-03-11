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
            color: "#1DC690",
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
            borderColor: "#1DC690",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1DC690",
          },
          "& .MuiSvgIcon-root": {
            color: "white",
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: "#278AB0",
          border: "2px solid white",
          "& .MuiMenu-list": {
            padding: 0,
          },
          "& .MuiMenuItem-root": {
            color: "white",
            borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
            "&:last-child": {
              borderBottom: "none",
            },
            "&.Mui-selected": {
              backgroundColor: "#1DC690",
            },
            "&.Mui-selected:hover": {
              backgroundColor: "#1DC690",
            },
            "&:hover": {
              backgroundColor: "#1DC690",
            },
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
        popper: {
          "& .MuiPaper-root": {
            backgroundColor: "#278AB0",
            border: "2px solid white",
            "& .MuiAutocomplete-listbox": {
              padding: 0,
              "& .MuiAutocomplete-option": {
                color: "white",
                borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
                "&:last-child": {
                  borderBottom: "none",
                },
              },
              "& .MuiAutocomplete-option[aria-selected='true']": {
                backgroundColor: "#1DC690",
              },
              "& .MuiAutocomplete-option.Mui-focused": {
                backgroundColor: "#1DC690",
              },
              "& .MuiAutocomplete-option:hover": {
                backgroundColor: "#1DC690",
              },
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          "&.MuiAutocomplete-paper": {
            backgroundColor: "#278AB0",
            border: "2px solid white",
            "& .MuiAutocomplete-listbox": {
              padding: 0,
              "& .MuiAutocomplete-option": {
                color: "white",
                borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
                "&:last-child": {
                  borderBottom: "none",
                },
              },
            },
          },
        },
      },
    },
  },
};

const theme = createTheme(themeOptions);
export default theme;
