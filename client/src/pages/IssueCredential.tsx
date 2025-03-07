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
  ButtonGroup,
  Alert,
} from "@mui/material";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router";
import { issueCredentialType } from "../utils/credential.util";
import { parseCSV } from "../utils/csv.util";

export default function IssueCredential() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [displayMessage, setDisplayMessage] = useState<string | null>(null);
  const { user } = useUser();
  const [email, setEmail] = useState<string | null>(null);
  const [selectedCredentialId, setSelectedCredentialId] = useState<number>(0);
  const [file, setFile] = useState<File | null>(null);
  const [batch, setBatch] = useState(false);

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    setSelectedCredentialId(Number(e.target.value));
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const uploadedFile = e.target.files[0];
      if (uploadedFile.type !== "text/csv") {
        setError("Please upload a valid CSV file.");
        setFile(null);
      } else {
        setError(null);
        setFile(uploadedFile);
      }
    }
  };

  async function onIssueInstitutionCredential(
    emails: string[],
    credential_id: number
  ) {
    const data = await issueCredentialType(emails, credential_id);

    if (data.status && Array.isArray(data.issued)) {
      const successful: string[] = data.issued;
      const failed = emails.filter((e) => !data.issued.includes(e));

      if (successful.length > 0) {
        setDisplayMessage(
          `${
            successful.length > 1 ? successful.length + " " : ""
          }Credential(s) Issued`
        );
      }
      if (failed.length > 0) {
        setError(
          `${
            failed.length > 1 ? failed.length + " " : ""
          }Credential(s) Failed: ${failed.join(", ")}`
        );
      }
    }
  }

  const validateForm = (emails: string[]): boolean => {
    if (selectedCredentialId === 0 || emails.length === 0) {
      setError("Please fill in all required fields");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const email of emails) {
      if (!emailRegex.test(email)) {
        setError("Please enter a valid email address");
        return false;
      } else if (email === user?.email) {
        setError("You cannot issue a credential to yourself");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setDisplayMessage(null);

    const extractedEmails = [];

    if (file) {
      try {
        const extracted = await parseCSV(file);

        if (Array.isArray(extracted)) {
          extractedEmails.push(...extracted);
        }
      } catch (error: any) {
        setError("Error parsing CSV: " + error.message);
        return;
      }
    } else if (email !== null) {
      extractedEmails.push(email);
    }

    if (extractedEmails.length === 0) {
      setError("Please input valid emails");
      return;
    }

    if (validateForm(extractedEmails)) {
      setLoading(true);
      setError(null);
      try {
        await onIssueInstitutionCredential(
          extractedEmails,
          selectedCredentialId
        );

        setEmail(null);
        setFile(null);
        setSelectedCredentialId(0);
      } catch (error) {
        console.error("Failed to issue credential:", error);
        setError("Failed to issue credential");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
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

            {displayMessage && (
              <Alert severity="success">{displayMessage}</Alert>
            )}
            {error && <Alert severity="error">{error}</Alert>}

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <FormControl fullWidth required>
                  <InputLabel id="credential-select-label">
                    Select Credential
                  </InputLabel>
                  <Select
                    labelId="credential-select-label"
                    name="credentialId"
                    value={selectedCredentialId.toString()}
                    onChange={handleSelectChange}
                    label="Select Credential"
                  >
                    {user?.issuer?.credential_types.map((credential) => (
                      <MenuItem key={credential.id} value={credential.id}>
                        {credential.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <ButtonGroup variant="contained">
                  <Button
                    variant={batch ? "contained" : "outlined"}
                    onClick={() => setBatch(false)}
                  >
                    Single
                  </Button>
                  <Button
                    variant={batch ? "outlined" : "contained"}
                    onClick={() => setBatch(true)}
                  >
                    Import CSV
                  </Button>
                </ButtonGroup>

                {batch ? (
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                  />
                ) : (
                  <FormControl fullWidth required>
                    <TextField
                      label="User Email"
                      name="email"
                      value={email}
                      onChange={handleEmailChange}
                      required
                      fullWidth
                    />
                  </FormControl>
                )}

                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Button
                    variant="outlined"
                    color="secondary"
                    sx={{
                      minWidth: "200px",
                      py: 1.5,
                      "&:hover": {
                        backgroundColor: "#2c387e",
                      },
                    }}
                    onClick={() => navigate("/createcredential")}
                  >
                    Create a Credential
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    loading={loading}
                    sx={{
                      minWidth: "200px",
                      py: 1.5,
                      "&:hover": {
                        backgroundColor: "#2c387e",
                      },
                    }}
                  >
                    Issue Credential
                  </Button>
                </Stack>
              </Stack>
            </form>

            {/* Navigate to Batch Send Page */}
            <Stack alignItems="center">
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate("/batchsend")}
                sx={{ minWidth: "200px", py: 1.5 }}
              >
                Batch Send Credentials
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
