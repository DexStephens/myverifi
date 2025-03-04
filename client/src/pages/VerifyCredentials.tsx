import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import AdditionIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Container,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import {
  CredentialRequest,
  getIssuersWithCredentialTypes,
  verifyCredentials,
} from "../utils/verify.util";
import { Issuer } from "../utils/user.util";

export default function VerifyCredentials() {
  //NEEDSWORK: List of Insitutions and credentials, with one email
  const [issuers, setIssuers] = useState<Issuer[] | null>(null);
  const [email, setEmail] = useState("");
  const [credentials, setCredentials] = useState<CredentialRequest[]>([
    { issuerId: -1, tokenId: "" },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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

    if (email === "") {
      setError("Email is required");
      return;
    }
    console.log(credentials);

    if (
      credentials.filter((c) => c.issuerId === -1 || c.tokenId === "").length >
      0
    ) {
      setError("All credentials must be selected");
      return;
    }

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

    if (response.status) {
      if (response.valid) {
        setError("Credentials verified");
      } else {
        setError("Credentials not verified");
      }
    } else {
      setError(response.error);
    }

    setSubmitting(false);
  };

  if (issuers === null) {
    return <h4>Loading...</h4>;
  }

  //NEEDSWORK: handle submitting state

  return (
    <>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Card sx={{ backgroundColor: "#f5f5f5" }}>
          <CardContent>
            <Stack spacing={3}>
              <Typography variant="h4" align="center" sx={{ color: "#333" }}>
                Verify Credentials
              </Typography>
              {error && (
                <Typography color="error" align="center">
                  {error}
                </Typography>
              )}

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
                      <Typography align="center" sx={{ color: "#333" }}>
                        Credential #{idx + 1}
                      </Typography>
                      <Autocomplete
                        disablePortal
                        options={issuers.map((issuer) => issuer.name)}
                        value={
                          issuers.find(
                            (issuer) => issuer.id === credential.issuerId
                          )?.name || null
                        }
                        sx={{ borderRadius: 2, backgroundColor: "white" }}
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
                                            (issuer) => issuer.name === newValue
                                          )?.id as number)
                                        : -1,
                                  }
                                : c
                            )
                          );
                        }}
                      />
                      <Autocomplete
                        disablePortal
                        options={
                          issuers
                            .find((issuer) => issuer.id === credential.issuerId)
                            ?.credential_types.map((ct) => ct.name) || []
                        }
                        sx={{ borderRadius: 2, backgroundColor: "white" }}
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
                          console.log(
                            newValue,

                            issuers
                              .find(
                                (issuer) =>
                                  issuer.id === credentials[0].issuerId
                              )
                              ?.credential_types.find(
                                (ct) => ct.name == newValue
                              )
                              ?.token_id.toString()
                          );
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
                  sx={{ backgroundColor: "white", borderRadius: 2 }}
                />
                <Button type="submit" variant="contained">
                  Verify
                </Button>
              </form>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
