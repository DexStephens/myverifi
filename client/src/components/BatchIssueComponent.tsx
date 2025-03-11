import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import {
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  FormControl,
  Container,
  Select,
  MenuItem,
  InputLabel,
  SelectChangeEvent,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloseIcon from "@mui/icons-material/Close";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { parseCSV } from "../utils/csv.util";
import "../styles/style.scss";
import { useUser } from "../context/UserContext";

export default function BatchSendCredentials({
  onClose,
}: {
  onClose: () => void;
}) {
  const [selectedCredential, setSelectedCredential] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const { user } = useUser();

  useEffect(() => {
    console.log("Updated emails state:", emails);
  }, [emails]);

  const existingCredentials = user?.issuer?.credential_types || [
    {
      id: 0,
      issuer_id: 0,
      token_id: "0",
      name: "No Credentials, Create a Credential First",
    },
  ];

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    setSelectedCredential(e.target.value);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const uploadedFile = e.target.files[0];
      if (uploadedFile.type !== "text/csv") {
        setError("Please upload a valid CSV file.");
        setFile(null);
        setFileName("");
      } else {
        setError(null);
        setFile(uploadedFile);
        setFileName(uploadedFile.name);
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCredential || !file) {
      setError("Please select a credential and upload a valid CSV file.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const extractedEmails = await parseCSV(file);
      if (extractedEmails instanceof Error) {
        throw new Error("Error parsing CSV: " + extractedEmails.message);
      }
      console.log("Extracted emails:", extractedEmails);
      setEmails(extractedEmails);
      setError(null);
      //NEEDSWORK: 1. validate the emails first with the backend to get their wallet addresses 2. Write credentials to the blockchain
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  //NEEDSWORK: Update to use the issuer's credential types instead of the hard coded ones, offering a redirect to create a credential if they do not have any yet

  return (
    <Container maxWidth="sm" sx={{ py: 4 }} className="fade-in">
      <Card sx={{ backgroundColor: "primary.main" }}>
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
            Issue Batch
          </Typography>

          {error && (
            <Typography color="error" align="center">
              {error}
            </Typography>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <FormControl fullWidth required>
                <InputLabel id="credential-select-label">
                  Select Credential
                </InputLabel>
                <Select
                  labelId="credential-select-label"
                  value={selectedCredential}
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

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
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
                    {fileName ? (
                      <Tooltip title={fileName} arrow>
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
                          {fileName}
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
                <Button
                  type="submit"
                  size="large"
                  variant="contained"
                  color="secondary"
                  disabled={loading || !file}
                  sx={{
                    flexShrink: 0, // Prevents the button from shrinking
                    "&:hover": {
                      backgroundColor: "success.main",
                    },
                    "&.Mui-disabled": {
                      backgroundColor: "rgba(39, 138, 176, 0.5)",
                      color: "rgba(255, 255, 255, 0.5)",
                    },
                  }}
                >
                  {loading ? "Issuing Credentials..." : "Issue Credentials"}
                </Button>
              </Box>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}
