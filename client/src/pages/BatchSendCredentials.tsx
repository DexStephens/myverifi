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
} from "@mui/material";
import { parseCSV } from "../utils/csv.util";

const existingCredentials = [
  { id: "1", title: "Credential 1" },
  { id: "2", title: "Credential 2" },
  { id: "3", title: "Credential 3" },
];

export default function BatchSendCredentials() {
  const [selectedCredential, setSelectedCredential] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);

  useEffect(() => {
    console.log("Updated emails state:", emails);
  }, [emails]);

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    setSelectedCredential(e.target.value);
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
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Card sx={{ backgroundColor: "#f5f5f5" }}>
        <CardContent>
          <Stack spacing={3}>
            <Typography variant="h4" align="center" sx={{ color: "#333" }}>
              Batch Send Credentials
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
                      <MenuItem key={credential.id} value={credential.id}>
                        {credential.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <input type="file" accept=".csv" onChange={handleFileChange} />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Submit"}
                </Button>
              </Stack>
            </form>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
