import { useState, FormEvent, ChangeEvent, useEffect } from "react";
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
  IconButton,
  Box,
} from "@mui/material";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router";
import { issueCredentialType } from "../utils/credential.util";
import CloseIcon from "@mui/icons-material/Close";

interface CredentialFormData {
  credentialId: string;
  email: string;
}

export default function IssueCredential({
  credentialType,
  onClose,
  onBatchIssue,
}: {
  credentialType: string | null;
  onClose: () => void;
  onBatchIssue: () => void;
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CredentialFormData>({
    credentialId: credentialType || "",
    email: "",
  });
  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (!user.issuer) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const existingCredentials = user?.issuer?.credential_types || [
    {
      id: 0,
      issuer_id: 0,
      token_id: "0",
      name: "No Credentials, Create a Credential First",
    },
  ];

  async function onIssueInstitutionCredential(
    emails: string[],
    credential_id: number
  ) {
    //NEEDSWORK: This does return a list of emails that were successful, but we can handle this at a later date
    await issueCredentialType(emails, credential_id);

    return true;
  }

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
    if (!formData.credentialId || !formData.email) {
      setError("Please fill in all required fields");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    } else if (formData.email === user?.email) {
      setError("You cannot issue a credential to yourself");
      return false;
    }

    //TODO: Check if the email is associated with a registered user (holder)

    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      setError(null);
      try {
        if (formData.credentialId === "0") {
          alert("Please create a credential first");
          return;
        }

        await onIssueInstitutionCredential(
          [formData.email],
          Number(formData.credentialId)
        );

        setFormData({
          credentialId: "",
          email: "",
        });
      } catch (error) {
        console.error("Failed to issue credential:", error);
        setError("Failed to issue credential");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Container sx={{ py: 4 }} maxWidth="sm">
      <Card>
        <CardContent sx={{ position: "relative" }}>
          <Box
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              zIndex: 1,
            }}
          >
            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                color: "white",
                "&:hover": {
                  color: "error.main",
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          <Typography
            variant="h4"
            component="h1"
            align="center"
            gutterBottom
            color="white"
            sx={{ ml: 2 }}
          >
            Issue Credential
          </Typography>

          {error && (
            <Typography color="error" align="center" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <Stack spacing={3}>
              <FormControl fullWidth required>
                <InputLabel id="credential-select-label">
                  Select Credential
                </InputLabel>
                <Select
                  labelId="credential-select-label"
                  name="credentialId"
                  value={formData.credentialId}
                  onChange={handleSelectChange}
                  label="Select Credential"
                >
                  {existingCredentials.map((credential) => (
                    <MenuItem
                      key={credential.id}
                      value={credential.id}
                      sx={{ color: "white" }}
                    >
                      {credential.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth required>
                <TextField
                  label="User Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  fullWidth
                />
              </FormControl>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    onClose();
                    onBatchIssue();
                  }}
                  size="large"
                  sx={{
                    "&:hover": { color: "success.main" },
                    fontWeight: "bold",
                  }}
                >
                  Batch Issue
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  size="large"
                  disabled={loading}
                  loading={loading}
                  sx={{
                    "&:hover": { backgroundColor: "success.main" },
                  }}
                >
                  Issue Credential
                </Button>
              </Box>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}
