import {
  Toolbar,
  Button,
  Box,
  Typography,
  Stack,
  Divider,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router";
import { useUser } from "../context/UserContext";

export default function HomeHeader() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = window.innerWidth <= 768;

  const handleLogout = async () => {
    logout();
  };

  return (
    // <AppBar position="sticky" color="success" elevation={3}>
    <>
      <Toolbar
        sx={{
          justifyContent: "space-between",
          px: 2,
        }}
      >
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Typography variant="h6" component="div" color="primary">
            myverifi
          </Typography>
        </Link>
        <Box>
          {user ? (
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              flexWrap={"wrap"}
              justifyContent={"flex-end"}
              pb={1}
            >
              {!isMobile && (
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "primary.main",
                  }}
                >
                  Welcome, {user.issuer?.name || user.email}
                </Typography>
              )}
              {location.pathname !== "/dashboard" && (
                <Button
                  onClick={() => navigate("/dashboard")}
                  variant="contained"
                  color="secondary"
                  sx={{
                    "&:hover": { backgroundColor: "#4CAF50", color: "white" },
                  }}
                  size="small"
                >
                  Dashboard
                </Button>
              )}
              <Button
                onClick={handleLogout}
                variant="contained"
                color="secondary"
                sx={{
                  "&:hover": {
                    backgroundColor: "error.main",
                  },
                }}
                size="small"
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
    // </AppBar>
  );
}
