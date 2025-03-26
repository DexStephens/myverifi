import { useUser } from "../context/UserContext";
import { useState, FormEvent, useEffect } from "react";
import {
  Typography,
  Button,
  Stack,
  TextField,
  Container,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import { useNavigate } from "react-router";
import { createCredentialType } from "../utils/credential.util";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CloseIcon from "@mui/icons-material/Close";
import { uploadJsonToPinata } from "../utils/pinata.util";
import { useCredentialQueue } from "../hooks/useCredentialQueue";

interface CredentialDetail {
  descriptor: string;
  value: string;
}

export default function CreateCredential({ onClose }: { onClose: () => void }) {
  const [credentialName, setCredentialName] = useState("");
  //I couldn't get this to work, I think it goes too fast through so frontend thinks it's done before the actual transaction goes through
  //Maybe there's some way to once length of credential_types is increased by 1, then the button goes back to create credential and not submitting
  const [isCreating, setIsCreating] = useState(false);
  const [credentialDetails, setCredentialDetails] = useState<
    CredentialDetail[]
  >([]);
  const navigate = useNavigate();
  const { user } = useUser();
  const [error, setError] = useState<string | null>(null);
  const { startPolling } = useCredentialQueue(user);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submittedName, setSubmittedName] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (!user.issuer) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  if (!user) return null;

  async function onCreateInstitutionCredentialType(
    title: string,
    jsonData: object // Eventually we will need this, right now it does nothing
  ) {
    if (user) {
      if (!title) {
        setError("Please enter a Credential Name");
        return;
      }
      //First need to upload jsonData to pinata to get a cid to upload to the contract
      let cid: string | null = null;

      if (Object.keys(jsonData).length > 0) {
        cid = await uploadJsonToPinata(title, jsonData);
      } else {
        //No data to attach
        cid = "";
      }

      // //If successful, then we can create the credential type on our contract
      if (cid !== null) {
        await createCredentialType(user.email, title, cid);

        return true;
      }
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCreating(true);
    setError(null);
    setSubmittedName(credentialName);

    const detailsJson = credentialDetails.reduce((acc, detail) => {
      if (detail.descriptor && detail.value) {
        acc[detail.descriptor] = detail.value;
      }
      return acc;
    }, {} as { [key: string]: string });

    try {
      await onCreateInstitutionCredentialType(credentialName, detailsJson);

      // Show confirmation message
      setShowConfirmation(true);
      startPolling();
      setCredentialName("");
      setCredentialDetails([]);
    } catch (error) {
      console.error("Error Creating Credential:", error);
      alert("An error occurred while creating the credential");
    } finally {
      setIsCreating(false);
    }
  };

  const addCredentialDetail = () => {
    setCredentialDetails([...credentialDetails, { descriptor: "", value: "" }]);
  };

  const removeCredentialDetail = (index: number) => {
    setCredentialDetails(credentialDetails.filter((_, i) => i !== index));
  };

  const handleDetailChange = (
    index: number,
    field: keyof CredentialDetail,
    value: string
  ) => {
    const newDetails = [...credentialDetails];
    newDetails[index][field] = value;
    setCredentialDetails(newDetails);
  };

  return (
    <>
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
              Create Credential
              <Tooltip
                title={
                  "Enter the name of the credential and add any details to describe the attributes of this credential"
                }
                arrow
              >
                <IconButton size="small" color="success" sx={{ mt: -1 }}>
                  <HelpOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Typography>

            {error && (
              <Typography color="error" align="center" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <Stack spacing={3}>
                <TextField
                  label="Credential Name"
                  variant="outlined"
                  value={credentialName}
                  onChange={(e) => {
                    setCredentialName(e.target.value);
                    if (error) setError(null);
                  }}
                  required
                />

                {credentialDetails.map((detail, index) => (
                  <Stack
                    key={index}
                    direction="row"
                    spacing={2}
                    alignItems="center"
                  >
                    <TextField
                      label="Descriptor"
                      variant="outlined"
                      value={detail.descriptor}
                      onChange={(e) =>
                        handleDetailChange(index, "descriptor", e.target.value)
                      }
                      required
                      fullWidth
                    />
                    <TextField
                      label="Value"
                      variant="outlined"
                      value={detail.value}
                      onChange={(e) =>
                        handleDetailChange(index, "value", e.target.value)
                      }
                      required
                      fullWidth
                    />
                    <IconButton
                      onClick={() => removeCredentialDetail(index)}
                      color="error"
                      size="small"
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Stack>
                ))}
                <Stack direction="row" spacing={2}>
                  <Button
                    type="button"
                    variant="outlined"
                    color="secondary"
                    onClick={addCredentialDetail}
                    sx={{
                      "&:hover": { color: "success.main" },
                      fontWeight: "bold",
                    }}
                  >
                    + Add Credential Detail
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    size="large"
                    loading={isCreating}
                    disabled={isCreating}
                    sx={{ "&:hover": { backgroundColor: "success.main" } }}
                  >
                    Create Credential
                  </Button>
                </Stack>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Container>

      {/* Add Snackbar for confirmation */}
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
          {`"${submittedName}" is being created. Status will be available shortly.`}
        </Alert>
      </Snackbar>
    </>
  );
}
