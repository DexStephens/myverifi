import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import AdditionIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Container,
  IconButton,
  Stack,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  CredentialRequest,
  getIssuersWithCredentialTypes,
  verifyCredentials,
} from "../utils/verify.util";
import { Issuer } from "../utils/user.util";
import "../styles/style.scss";

export default function VerifyCredentials() {
  const [issuers, setIssuers] = useState<Issuer[] | null>(null);
  const [email, setEmail] = useState("");
  const [credentials, setCredentials] = useState<CredentialRequest[]>([
    { issuerId: -1, tokenId: "" },
  ]);
  const [displayMessage, setDisplayMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const credentialTypes =
    issuers?.flatMap((issuer) => issuer.credential_types) ?? [];

  useEffect(() => {
    const fetchIssuers = async () => {
      const response = await getIssuersWithCredentialTypes();

      setIssuers(response.issuers);
    };

    fetchIssuers();
  }, []);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(null);
  };

  const addCredential = () =>
    setCredentials((current) => [...current, { issuerId: -1, tokenId: "" }]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (
      credentials.filter((c) => c.issuerId === -1 || c.tokenId === "").length >
      0
    ) {
      setError("All credentials must be selected");
      return;
    }

    setError(null);
    setDisplayMessage(null);
    setSubmitting(true);

    const response = await verifyCredentials(
      email,
      credentials.map(
        (c) =>
          issuers
            ?.find((i) => i.id === c.issuerId)
            ?.credential_types.find((ct) => ct.token_id === c.tokenId)
            ?.id as number
      )
    );

    if (response.status && response.valid) {
      if (!response.valid.find((v) => !v.valid)) {
        setDisplayMessage(
          `${response.valid.length > 1 ? "All " : ""}Credentials verified`
        );
      } else {
        const successful = response.valid
          .filter((v) => v.valid)
          .map((v) => {
            const credential = credentialTypes.find(
              (ct) => ct.id === v.credential_type_id
            );

            return credential?.name;
          });
        const failed = response.valid
          .filter((v) => !v.valid)
          .map((v) => {
            const credential = credentialTypes.find(
              (ct) => ct.id === v.credential_type_id
            );

            return credential?.name;
          });

        if (successful.length > 0) {
          setDisplayMessage(
            `${successful.length} Credential(s) verified: ${successful.join(
              ", "
            )}`
          );
        }
        setError(`${failed.length} Credential(s) failed: ${failed.join(", ")}`);
      }
    } else if (response.error) {
      setError(response.error);
    }

    setSubmitting(false);
  };

  if (issuers === null) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }} className="fade-in">
      <Card sx={{ backgroundColor: "primary.main" }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h4" align="center" color="white">
              Verify Credentials
            </Typography>
            {displayMessage && (
              <Alert severity="success">{displayMessage}</Alert>
            )}
            {error && <Alert severity="error">{error}</Alert>}

            <form onSubmit={onSubmit}>
              {credentials.map((credential, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <div style={{ flexGrow: 1 }}>
                    <Typography align="center" color="white">
                      Credential #{idx + 1}
                    </Typography>
                    <Box mb={2}>
                      <Autocomplete
                        disablePortal
                        options={issuers.map((issuer) => issuer.name)}
                        value={
                          issuers.find(
                            (issuer) => issuer.id === credential.issuerId
                          )?.name || null
                        }
                        sx={{ borderRadius: 2, color: "white" }}
                        renderInput={(params) => (
                          <TextField {...params} label="Institution" />
                        )}
                        onChange={(_, newValue) => {
                          setCredentials((current) =>
                            current.map((c, i) =>
                              i === idx
                                ? {
                                    ...c,
                                    issuerId:
                                      newValue !== null
                                        ? (issuers.find(
                                            (issuer) =>
                                              issuer.name === newValue
                                          )?.id as number)
                                        : -1,
                                  }
                                : c
                            )
                          );
                        }}
                      />
                    </Box>
                    <Box>
                      <Autocomplete
                        disablePortal
                        options={
                          issuers
                            .find((issuer) => issuer.id === credential.issuerId)
                            ?.credential_types.map((ct) => ct.name) || []
                        }
                        sx={{ borderRadius: 2, color: "white" }}
                        renderInput={(params) => (
                          <TextField {...params} label="Credential Type" />
                        )}
                        value={
                          issuers
                            .find((issuer) => issuer.id === credential.issuerId)
                            ?.credential_types.find(
                              (ct) => ct.token_id === credential.tokenId
                            )?.name || null
                        }
                        onChange={(_, newValue) => {
                          setCredentials((current) =>
                            current.map((c, i) =>
                              i === idx
                                ? {
                                    ...c,
                                    tokenId:
                                      newValue !== null
                                        ? issuers
                                            .find(
                                              (issuer) =>
                                                issuer.id === c.issuerId
                                            )
                                            ?.credential_types.find(
                                              (ct) => ct.name == newValue
                                            )
                                            ?.token_id.toString() || ""
                                        : "",
                                  }
                                : c
                            )
                          );
                        }}
                      />
                    </Box>
                  </div>
                  {idx !== 0 && (
                    <IconButton
                      color="error"
                      onClick={() =>
                        setCredentials((current) =>
                          current.filter((_, i) => i !== idx)
                        )
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </div>
              ))}
              <Button
                variant="outlined"
                startIcon={<AdditionIcon />}
                onClick={addCredential}
                sx={{ color: "white", "&:hover": { color: "success.main" } }}
              >
                Add Credential
              </Button>
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                value={email}
                onChange={handleEmailChange}
                required
                sx={{ borderRadius: 2 }}
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  color="secondary"
                  loading={submitting}
                  sx={{
                    "&:hover": { backgroundColor: "success.main" },
                  }}
                >
                  Verify
                </Button>
              </Box>
            </form>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}