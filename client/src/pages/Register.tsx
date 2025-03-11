import { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router";
import {
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  FormControl,
  Box,
  Container,
  FormControlLabel,
  Checkbox,
  Tooltip,
  IconButton,
} from "@mui/material";
import "../styles/style.scss";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { registerUser } from "../utils/registration.util";
import { useUser } from "../context/UserContext";
import "../styles/style.scss";

interface RegistrationFormData {
  isOrganization: boolean;
  email: string;
  password: string;
  title?: string;
}

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useUser();
  const [formData, setFormData] = useState<RegistrationFormData>({
    email: "",
    password: "",
    title: "",
    isOrganization: false,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Clear errors when user starts typing
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: false,
    }));
  };

  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors: Record<keyof RegistrationFormData, boolean> = {
      email: !formData.email,
      password: !formData.password,
      title: formData.isOrganization && !formData.title ? true : false,
      isOrganization: false,
    };

    const hasErrors = Object.values(newErrors).some((error) => error);
    if (hasErrors) {
      setError("Please fill in all required fields");
    }
    setErrors(newErrors);
    return !hasErrors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      setError(null);
      try {
        const response = await registerUser(
          formData.email,
          formData.password,
          formData.title,
          setUser
        );

        if (response.status) {
          console.log("Registration successful:", response.user);
          sessionStorage.setItem("token", response.user.token);
          navigate("/dashboard");
        } else {
          setError(response.error || "Registration failed");
        }
      } catch (error) {
        console.error("Registration failed:", error);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleExistingUser = () => {
    navigate("/login");
  };

  // State for validation errors
  const [errors, setErrors] = useState<
    Record<keyof RegistrationFormData, boolean>
  >({
    email: false,
    password: false,
    title: false,
    isOrganization: false,
  });

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
        <Box className="fade-in" sx={{ width: { xs: "100%", md: "55%" } }}>
          <Card>
            <CardContent>
              <Typography
                variant="h4"
                component="h1"
                align="center"
                gutterBottom
                color="white"
              >
                {formData.isOrganization
                  ? "Register as an Organization"
                  : "Register as a Holder"}
                <Tooltip
                  title={
                    formData.isOrganization
                      ? "An organization is an entity that issues credentials, such as universities granting degrees or online courses awarding badges for completion."
                      : "A holder is the recipient of a credential, like a student receiving a degree or a professional earning a certification."
                  }
                  arrow
                >
                  <IconButton size="small" color="success">
                    <HelpOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Typography>

              {error && (
                <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
                  {error}
                </Typography>
              )}
              <FormControl fullWidth margin="normal">
                <FormControlLabel
                  control={
                    <Checkbox
                      name="isOrganization"
                      sx={{
                        color: "white",
                        "&.Mui-checked": {
                          color: "white",
                        },
                      }}
                      checked={formData.isOrganization}
                      onChange={(e) =>
                        setFormData((prevData) => ({
                          ...prevData,
                          isOrganization: e.target.checked,
                          title: e.target.checked ? "" : undefined,
                        }))
                      }
                    />
                  }
                  sx={{
                    color: "white",
                  }}
                  label="I want to Issue Credentials"
                />
              </FormControl>
              <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal" error={errors.email}>
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    fullWidth
                  />
                </FormControl>
                <FormControl fullWidth margin="normal" error={errors.password}>
                  <TextField
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    fullWidth
                  />
                </FormControl>
                {formData.isOrganization && (
                  <FormControl fullWidth margin="normal" error={errors.title}>
                    <TextField
                      label="Organization Name"
                      name="title"
                      type="text"
                      value={formData.title}
                      onChange={handleInputChange}
                      required={formData.isOrganization}
                      fullWidth
                    />
                  </FormControl>
                )}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 2,
                    mt: 4,
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
                    Already have an account?
                  </Typography>
                  <Button
                    onClick={handleExistingUser}
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
                    Log in
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    disabled={loading}
                    loading={loading}
                    sx={{
                      "&:hover": {
                        backgroundColor: "success.main",
                      },
                    }}
                  >
                    Register
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
