import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { CONSTANTS } from "../config/constants";

declare module "@mui/material/styles" {
  interface Palette {
    tertiary: Palette["primary"];
    accent: Palette["primary"];
  }
  interface PaletteOptions {
    tertiary?: PaletteOptions["primary"];
    accent?: PaletteOptions["primary"];
  }
}

let theme = createTheme({
  palette: {
    background: {
      default: CONSTANTS.THEME.TERTIARY,
      paper: CONSTANTS.THEME.TERTIARY,
    },
    primary: {
      main: CONSTANTS.THEME.PRIMARY,
    },
    secondary: {
      main: CONSTANTS.THEME.SECONDARY,
    },
    tertiary: {
      main: CONSTANTS.THEME.TERTIARY,
    },
    accent: {
      main: CONSTANTS.THEME.ACCENT,
    },
    error: {
      main: CONSTANTS.THEME.ERROR,
    },
    success: {
      main: CONSTANTS.THEME.ACCENT,
    },
  },
  typography: {
    fontFamily: CONSTANTS.THEME.FONT_FAMILY.join(","),
    fontSize: CONSTANTS.THEME.FONT_SIZE,
  },
  spacing: CONSTANTS.THEME.SPACING,
});

theme = responsiveFontSizes(theme, {
  breakpoints: ["xs", "sm", "md", "lg", "xl"],
  factor: 2,
});

export { theme };
