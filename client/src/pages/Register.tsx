import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  FormControl,
  Stack,
  Container,
} from "@mui/material";
import "./Home.scss";
import HomeHeader from "../components/HomeHeader";
import { registerUser } from "../utils/registration.util";
import { useUser } from "../context/UserContext";
import { useAccount } from "wagmi";
import { WagmiConnectWallet } from "../components/WagmiConnectWallet";

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
  wallet_address: string;
}

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useUser();
  const { address } = useAccount();
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
    wallet_address: address ?? "",
  });

  useEffect(() => {
    if (address) {
      setFormData((prev) => ({
        ...prev,
        wallet_address: address,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        wallet_address: "",
      }));
    }
  }, [address]);

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
          formData.phone,
          setUser
        );

        if (response.status) {
          console.log("Registration successful:", response.user);
          //sessionStorage.setItem("user", JSON.stringify(response.user));
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
    street_address: false,
    city: false,
    state: false,
    zip: false,
    country: false,
    phone: false,
    wallet_address: false,
  });

  return (
    <>
      <HomeHeader />
      <Container maxWidth="md" sx={{ width: "60%" }}>
        <div className="home-wrapper">
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
                        field.slice(1).replace("_", " ")
                      }
                      name={field}
                      type={field === "password" ? "password" : "text"}
                      value={formData[field as keyof RegistrationFormData]}
                      onChange={handleInputChange}
                      required
                    />
                  </FormControl>
                ))}

                <Stack spacing={2} sx={{ mt: 4, mb: 4 }}>
                  <Stack direction="row" spacing={2} justifyContent="center">
                    <Button
                      variant="contained"
                      color="primary"
                      href="https://metamask.io/"
                      target="_blank"
                    >
                      Create a Wallet
                    </Button>
                    <WagmiConnectWallet />
                  </Stack>
                </Stack>

                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="center"
                  sx={{ mt: 4 }}
                >
                  <Typography
                    onClick={handleExistingUser}
                    sx={{
                      textDecoration: "underline",
                      cursor: "pointer",
                      color: "primary.main",
                      "&:hover": {
                        color: "primary.dark",
                      },
                      alignSelf: "center",
                    }}
                  >
                    Already have an account? Login
                  </Typography>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                  >
                    {loading ? "Registering..." : "Register"}
                  </Button>
                </Stack>
              </form>
            </CardContent>
          </Card>
        </div>
      </Container>
    </>
  );
}
