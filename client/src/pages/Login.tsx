import { useState, FormEvent } from "react";
import { Container, TextField, Button, Box, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router";
import HomeHeader from "../components/HomeHeader";
import { loginUser } from "../utils/login.util";
import { useUser } from "../context/UserContext";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await loginUser(email, password, setUser);
      console.log("Login response:", response);

      if (response.status) {
        //sessionStorage.setItem("user", JSON.stringify(response.user));
        navigate("/dashboard");
      } else {
        console.error("Login failed: ", response.error);
        setError(response.error || "Login failed");
        setPassword("");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HomeHeader />
      <Container maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Login
          </Typography>
          {error && (
            <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
              {error}
            </Typography>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              value={email}
              onChange={handleEmailChange}
              required
              InputProps={{
                sx: {
                  backgroundColor: "#E6E6FA", // Light lavender background
                  borderRadius: 2,
                },
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              type="password"
              label="Password"
              value={password}
              onChange={handlePasswordChange}
              required
              InputProps={{
                sx: {
                  backgroundColor: "#E6E6FA", // Light lavender background
                  borderRadius: 2,
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </Box>
        </Box>
      </Container>
      <Container>
        <Link to="/register" color="inherit">
          Don't have an account? Register Here!
        </Link>
      </Container>
    </>
  );
}
