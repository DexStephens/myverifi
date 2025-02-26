import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import AdditionIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { Button } from "@mui/material";

type CredentialRequest = {
  issuer: string;
  tokenId: string;
};

export default function VerifyCredentials() {
  //NEEDSWORK: List of Insitutions and credentials, with one email
  const [issuers, setIssuers] = useState<string[] | null>(null);
  const [email, setEmail] = useState("");
  const [credentials, setCredentials] = useState<CredentialRequest[]>([
    { issuer: "", tokenId: "" },
  ]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIssuers = async () => {};

    fetchIssuers();
  }, []);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(null);
  };

  const addCredential = () =>
    setCredentials((current) => [...current, { issuer: "", tokenId: "" }]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    //NEEDSWORK: handle submit here
    e.preventDefault();
  };

  if (issuers === null) {
    return <h4>Loading...</h4>;
  }

  return (
    <div>
      <h1>Verify Credentials page</h1>
      <form onSubmit={onSubmit}>
        {credentials.map((credential) => (
          <div>
            <Autocomplete
              disablePortal
              options={["BYU", "UofU", "UVU"]}
              sx={{ borderRadius: 2, backgroundColor: "white" }}
              renderInput={(params) => (
                <TextField {...params} label="Institution" />
              )}
            />
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
    </div>
  );
}
