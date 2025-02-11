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
} from "@mui/material";

import HomeHeader from "../components/HomeHeader";

interface CredentialFormData {
  title: string;
  description: string;
  issuedDate: Date | null;
  expiryDate: Date | null;
  ipfsHash: string;
}

export default function IssueCredential() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CredentialFormData>({
    title: "",
    description: "",
    issuedDate: new Date(),
    expiryDate: null,
    ipfsHash: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (
      !formData.title ||
      !formData.description ||
      !formData.issuedDate ||
      !formData.ipfsHash
    ) {
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
      <HomeHeader />
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
                  <FormControl>
                    <TextField
                      label="Credential Title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      fullWidth
                    />
                  </FormControl>

                  <FormControl>
                    <TextField
                      label="Description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      multiline
                      rows={4}
                      fullWidth
                    />
                  </FormControl>

                  <FormControl>
                    <TextField
                      label="IPFS Hash"
                      name="ipfsHash"
                      value={formData.ipfsHash}
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
