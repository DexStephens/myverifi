import { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router";
import {
  Typography,
  Button,
  Grid,
  TextField,
  Card,
  CardContent,
  FormControl,
} from "@mui/material";
import "./Home.scss";
import HomeHeader from "../components/HomeHeader";
import { registerUser } from "../utils/registration.util";

interface RegistrationFormData {
  email: string;
  password: string;
  title: string;
  street_address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<RegistrationFormData>({
    email: "",
    password: "",
    title: "",
    street_address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    phone: "",
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
    const newErrors = Object.keys(formData).reduce(
      (acc, key) => ({
        ...acc,
        [key]: !formData[key as keyof RegistrationFormData],
      }),
      {} as Record<keyof RegistrationFormData, boolean>
    );

    const hasErrors = Object.values(newErrors).some((error) => error);
    if (hasErrors) {
      setError("Please fill in all required fields");
    }
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
          formData.street_address,
          formData.city,
          formData.state,
          formData.zip,
          formData.country,
          formData.phone
        );

        if (response.status) {
          console.log("Registration successful:", response.user);
          sessionStorage.setItem("user", JSON.stringify(response.user));
          navigate("/connectwallet");
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
    street_address: false,
    city: false,
    state: false,
    zip: false,
    country: false,
    phone: false,
  });

  return (
    <>
      <HomeHeader />
      <div className="home-wrapper">
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ minHeight: "100vh" }}
        >
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography
                  variant="h4"
                  component="h1"
                  align="center"
                  gutterBottom
                >
                  Register Your Organization
                </Typography>
                {error && (
                  <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
                    {error}
                  </Typography>
                )}
                <form onSubmit={handleSubmit}>
                  {Object.keys(formData).map((field) => (
                    <FormControl
                      key={field}
                      fullWidth
                      margin="normal"
                      error={errors[field as keyof RegistrationFormData]}
                    >
                      <TextField
                        label={
                          field.charAt(0).toUpperCase() +
                          field.slice(1).replace("_", "")
                        }
                        name={field}
                        type={field === "password" ? "password" : "text"}
                        value={formData[field as keyof RegistrationFormData]}
                        onChange={handleInputChange}
                        required
                        fullWidth
                      />
                    </FormControl>
                  ))}
                  <Grid
                    container
                    justifyContent="center"
                    spacing={2}
                    marginTop={4}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={loading}
                    >
                      {loading ? "Registering..." : "Register"}
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleExistingUser}
                    >
                      Already have an account? Login
                    </Button>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </>
  );
}
