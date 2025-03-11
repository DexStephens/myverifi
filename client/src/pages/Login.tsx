import { useState, FormEvent } from "react";
import {
  CardContent,
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Card,
  FormControl,
} from "@mui/material";
import { Link, useNavigate } from "react-router";
import { loginUser } from "../utils/login.util";
import { useUser } from "../context/UserContext";
import "../styles/style.scss";

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
        sessionStorage.setItem("token", response.user.token);
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
    <div className="home-wrapper">
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <Box
          className="fade-in"
          sx={{
            width: { xs: "100%", md: "50%" },
          }}
        >
          <Card>
            <CardContent>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                align="center"
                color="white"
              >
                Login
              </Typography>
              {error && (
                <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
                  {error}
                </Typography>
              )}
              <form onSubmit={handleSubmit}>
                <FormControl fullWidth>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                  />
                </FormControl>
                <FormControl fullWidth>
                  <TextField
                    fullWidth
                    margin="normal"
                    type="password"
                    label="Password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                  />
                </FormControl>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 2,
                    mt: 3,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="white"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    Don't have an account?
                  </Typography>
                  <Button
                    component={Link}
                    to="/register"
                    sx={{
                      textTransform: "none",
                      color: "white",
                      minWidth: "auto",
                      textDecoration: "underline",
                      marginLeft: -2,
                      marginRight: 4,
                      "&:hover": {
                        backgroundColor: "transparent",
                        color: "success.main",
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Register
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    sx={{ "&:hover": { backgroundColor: "success.main" } }}
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Log In"}
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </div>
  );
}
