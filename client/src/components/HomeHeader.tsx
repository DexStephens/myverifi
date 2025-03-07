import { AppBar, Toolbar, Button, Box, Typography, Stack } from "@mui/material";
import { Link, useNavigate } from "react-router";
import { useUser } from "../context/UserContext";

export default function HomeHeader() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    logout();
  };

  return (
    <AppBar position="sticky" color="primary" elevation={3}>
      <Toolbar sx={{ justifyContent: "space-between", px: 4 }}>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Typography variant="h6" component="div">
            myverifi
          </Typography>
        </Link>
        <Box>
          {user ? (
            <Stack direction="row" spacing={2} alignItems="end">
              <Typography variant="subtitle1" sx={{ color: "white" }}>
                Welcome, {user.issuer?.name || user.email}
              </Typography>
              <Button
                onClick={() => navigate("/dashboard")}
                variant="contained"
                color="primary"
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
                  "&:hover": { backgroundColor: "#ff4444", color: "white" },
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
                "&:hover": { backgroundColor: "#4CAF50", color: "white" },
              }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
