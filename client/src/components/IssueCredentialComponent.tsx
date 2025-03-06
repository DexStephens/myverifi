import { Address } from "viem";
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
} from "@mui/material";
import { useWriteContract } from "wagmi";
import { useUser } from "../context/UserContext";
import { useNavigate, useParams } from "react-router";
import { CONSTANTS } from "../config/constants";
import { institutionCredentialAbi } from "../utils/abi.util";
import { retrieveUserAddress } from "../utils/user.util";

interface CredentialFormData {
  credentialId: string;
  email: string;
}

export default function IssueCredential() {
  const navigate = useNavigate();
  const { credentialType } = useParams<{ credentialType: string }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CredentialFormData>({
    credentialId: credentialType || "",
    email: "",
  });
  const { user } = useUser();
  const { writeContract } = useWriteContract();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (!user.issuer) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const existingCredentials = user?.issuer?.credential_types || [
    {
      token_id: "0",
      name: "No Credentials, Create a Credential First",
    },
  ];

  async function onIssueInstitutionCredential(
    contractAddress: Address,
    recipient: Address,
    tokenId: bigint
  ) {
    await writeContract({
      address: contractAddress,
      abi: institutionCredentialAbi,
      functionName: CONSTANTS.CONTRACT_FUNCTIONS.CREDENTIAL_ISSUE,
      args: [recipient, tokenId],
    });

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
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      setError(null);
      try {
        const contractAddress = user?.issuer?.contract_address;
        if (!contractAddress) {
          alert(
            "No contract address found for the issuer, if you recently registered, please retry in a few minutes to allow time for your smart contract to deploy"
          );
          return;
        }
        if (formData.credentialId === "0") {
          alert("Please create a credential first");
          return;
        }

        const userAddress = await handleGetUserAddress(formData.email);
        if (!userAddress) {
          return;
        }

        const credID = BigInt(formData.credentialId.slice(0, -1));
        onIssueInstitutionCredential(
          contractAddress,
          userAddress as Address,
          credID
        );
      } catch (error) {
        console.error("Failed to issue credential:", error);
        setError("Failed to issue credential");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGetUserAddress = async (email: string) => {
    const res = await retrieveUserAddress(email);
    if (res.status) {
      const userAddress = res.address;
      return userAddress;
    } else {
      setError(res.message);
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
                    name="credentialId"
                    value={formData.credentialId}
                    onChange={handleSelectChange}
                    label="Select Credential"
                  >
                    {existingCredentials.map((credential) => (
                      <MenuItem
                        key={credential.token_id}
                        value={credential.token_id}
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