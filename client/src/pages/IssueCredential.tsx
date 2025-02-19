import { useState, FormEvent, ChangeEvent } from "react";
import {
  Typography,
  Button,
  Stack,
  TextField,
  Card,
  CardContent,
  FormControl,
  Container,
  Select,
  MenuItem,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";

import HomeHeader from "../components/HomeHeader";

interface CredentialFormData {
  credentialId: string;
  walletAddress: string;
}

//Placeholder before we can bring in the actual credentials from the server
const existingCredentials = [
  { id: "1", title: "Credential 1" },
  { id: "2", title: "Credential 2" },
  { id: "3", title: "Credential 3" },
];

export default function IssueCredential() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CredentialFormData>({
    credentialId: "",
    walletAddress: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.credentialId || !formData.walletAddress) {
      setError("Please fill in all required fields");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      setError(null);
      try {
        // TODO: Add your credential issuance logic here
        console.log("Credential data:", formData);
      } catch (error) {
        console.error("Failed to issue credential:", error);
        setError("Failed to issue credential");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <HomeHeader showBackButton={true} />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Card sx={{ backgroundColor: "#f5f5f5" }}>
          <CardContent>
            <Stack spacing={3}>
              <Typography
                variant="h4"
                component="h1"
                align="center"
                sx={{ color: "#333" }}
              >
                Issue New Credential
              </Typography>

              {error && (
                <Typography color="error" align="center">
                  {error}
                </Typography>
              )}

              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                <FormControl fullWidth required>
                    <InputLabel id="credential-select-label">Select Credential</InputLabel>
                    <Select
                      labelId="credential-select-label"
                      name="credentialId"
                      value={formData.credentialId}
                      onChange={handleSelectChange}
                      label="Select Credential"
                    >
                      {existingCredentials.map((credential) => (
                        <MenuItem key={credential.id} value={credential.id}>
                          {credential.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth required>
                    <TextField
                      label="Wallet Address"
                      name="walletAddress"
                      value={formData.walletAddress}
                      onChange={handleInputChange}
                      required
                      fullWidth
                    />
                  </FormControl>

                  <Stack alignItems="center">
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={loading}
                      sx={{
                        minWidth: "200px",
                        py: 1.5,
                        "&:hover": {
                          backgroundColor: "#2c387e",
                        },
                      }}
                    >
                      {loading ? "Issuing..." : "Issue Credential"}
                    </Button>
                  </Stack>
                </Stack>
              </form>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
