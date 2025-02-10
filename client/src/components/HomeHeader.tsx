import { AppBar, Toolbar, Button, Box, Typography, Stack } from "@mui/material";
import { Link, useNavigate } from "react-router";
import { useAccount, useDisconnect } from "wagmi";
import { useEffect, useState } from "react";
import { WebUserLoginResponse } from "../pages/Dashboard";

export default function HomeHeader() {
  const navigate = useNavigate();
  const { disconnect } = useDisconnect();
  const { isConnected } = useAccount();
  const [user, setUser] = useState<WebUserLoginResponse | null>(null);

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  const handleLogout = () => {
    if (isConnected) {
      disconnect();
    }
    sessionStorage.removeItem("user");
    setUser(null);
    navigate("/");
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
                Welcome, {user.title}
              </Typography>
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
