import {
  Toolbar,
  Button,
  Box,
  Typography,
  Stack,
  Divider,
} from "@mui/material";
import { Link, useNavigate } from "react-router";
import { useUser } from "../context/UserContext";

export default function HomeHeader() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    logout();
  };

  return (
    <>
      <Toolbar
        sx={{
          justifyContent: "space-between",
          px: 2,
        }}
      >
        <Stack direction="row" spacing={3}>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Typography variant="h6" component="div" color="primary">
              myverifi
            </Typography>
          </Link>
          {window.location.pathname === "/" ? (
            <Button
              onClick={() => {
                if (window.location.pathname !== "/") {
                  navigate("/", { state: { scrollToAbout: true } });
                } else {
                  const element = document.getElementById("about");
                  element?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              sx={{
                textTransform: "none",
                color: "primary.main",
                "&:hover": {
                  background: "none",
                },
              }}
            >
              <Typography variant="subtitle2">About Us</Typography>
            </Button>
          ) : (
            <></>
          )}
        </Stack>
        <Box>
          {user ? (
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography
                variant="subtitle1"
                sx={{
                  color: "primary.main",
                }}
              >
                Welcome, {user.issuer?.name || user.email}
              </Typography>
              <Button
                onClick={() => navigate("/dashboard")}
                variant="contained"
                color="secondary"
                sx={{
                  "&:hover": { backgroundColor: "#4CAF50", color: "white" },
                }}
              >
                Dashboard
              </Button>
              <Button
                onClick={handleLogout}
                variant="contained"
                color="secondary"
                sx={{
                  "&:hover": {
                    backgroundColor: "error.main",
                  },
                }}
              >
                Logout
              </Button>
            </Stack>
          ) : (
            <Button
              component={Link}
              to="/login"
              variant="contained"
              color="secondary"
              sx={{
                "&:hover": {
                  backgroundColor: "success.main",
                  color: "white",
                },
              }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
      <Divider
        variant="middle"
        sx={{ border: "1px solid rgba(28, 70, 112, 0.4)" }}
      />
    </>
  );
}
