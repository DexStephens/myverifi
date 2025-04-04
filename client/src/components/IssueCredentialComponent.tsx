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
  Alert,
  Tooltip,
  Snackbar,
} from "@mui/material";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router";
import { issueCredentialType } from "../utils/credential.util";
import CloseIcon from "@mui/icons-material/Close";
import { parseCSV } from "../utils/csv.util";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import UploadFileIcon from "@mui/icons-material/UploadFile";

export default function IssueCredential({
  credentialType,
  onClose,
}: {
  credentialType: number | null;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [displayMessage, setDisplayMessage] = useState<string | null>(null);
  const { user } = useUser();
  const [email, setEmail] = useState<string | null>(null);
  const [selectedCredentialId, setSelectedCredentialId] = useState<
    number | null
  >(credentialType);
  const [file, setFile] = useState<File | null>(null);
  const [batch, setBatch] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [credentialName, setCredentialName] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (!user.issuer) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const removeErrors = () => {
    if (error || displayMessage) {
      setError(null);
      setDisplayMessage(null);
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    removeErrors();
    setSelectedCredentialId(Number(e.target.value));
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    removeErrors();
    setEmail(e.target.value);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    removeErrors();
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
    if (selectedCredentialId === null || emails.length === 0) {
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
    setCredentialName(
      user?.issuer?.credential_types.find(
        (credential) => credential.id === selectedCredentialId
      )?.name ?? ""
    );

    const extractedEmails = [];

    if (file) {
      try {
        const extracted = await parseCSV(file);

        if (Array.isArray(extracted)) {
          extractedEmails.push(...extracted);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
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
          selectedCredentialId ?? 0
        );

        setEmail("");
        setFile(null);
        setSelectedCredentialId(0);
        setShowConfirmation(true);
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
            sx={{ m: 2 }}
          >
            Issue Credential
          </Typography>

          {displayMessage && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {displayMessage}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
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
                  value={selectedCredentialId?.toString()}
                  onChange={handleSelectChange}
                  label="Select Credential"
                >
                  {user?.issuer?.credential_types.map((credential) => (
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
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  color="secondary"
                  variant={batch ? "outlined" : "contained"}
                  onClick={() => setBatch(false)}
                >
                  Single
                </Button>
                <Button
                  color="secondary"
                  variant={batch ? "contained" : "outlined"}
                  onClick={() => setBatch(true)}
                >
                  Batch
                </Button>
              </Box>
              {batch ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flex: 1,
                    minWidth: 0, // This allows the box to shrink below its content size
                  }}
                >
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<UploadFileIcon />}
                    size="large"
                    color="secondary"
                    sx={{
                      "&:hover": {
                        backgroundColor: "success.main",
                      },
                      flexShrink: 0, // Prevents the button from shrinking
                    }}
                  >
                    Upload CSV
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                  </Button>
                  <Box
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      maxWidth: "200px",
                    }}
                  >
                    {file?.name ? (
                      <Tooltip title={file.name} arrow>
                        <Typography
                          color="white"
                          sx={{
                            ml: 2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            opacity: 1,
                          }}
                        >
                          {file.name}
                        </Typography>
                      </Tooltip>
                    ) : (
                      <Tooltip
                        title="Upload a CSV file containing a list of email addresses to issue credentials to multiple users at once"
                        arrow
                      >
                        <IconButton size="small" color="success" sx={{ ml: 1 }}>
                          <HelpOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </Box>
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
              <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
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
      <Snackbar
        open={showConfirmation}
        autoHideDuration={2000}
        onClose={() => setShowConfirmation(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          variant="filled"
          sx={{
            width: "100%",
            backgroundColor: "success.main",
            color: "white",
            "& .MuiAlert-icon": {
              color: "white",
            },
          }}
        >
          {`"Credential: ${credentialName} is being issued. Click on the hourglass to check status.`}
        </Alert>
      </Snackbar>
    </Container>
  );
}
