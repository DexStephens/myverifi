import { Address } from "viem";
import HomeHeader from "../components/HomeHeader";
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
  Box,
} from "@mui/material";
import { useWriteContract } from "wagmi";
import { institutionCredentialAbi } from "../utils/abi.util";
// import { Address } from "viem";
import { CONSTANTS } from "../config/constants";
import RemoveIcon from "@mui/icons-material/Remove";
import { useNavigate } from "react-router";

interface CredentialDetail {
  descriptor: string;
  value: string;
}

export default function CreateCredential() {
  const [credentialName, setCredentialName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [credentialDetails, setCredentialDetails] = useState<
    CredentialDetail[]
  >([]);
  const navigate = useNavigate();
  const { user } = useUser();
  const { writeContract } = useWriteContract();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (!user.issuer) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  if (!user) return null;

  async function onCreateInstitutionCredentialType(
    contractAddress: Address,
    title: string,
    jsonData: object
  ) {
    console.log(jsonData);
    //First need to upload jsonData to pinata to get a cid to upload to the contract
    // const cid = await uploadJsonToPinata(title, jsonData);

    // //If successful, then we can create the credential type on our contract
    // if (cid !== null) {

    if (!title) {
      alert("Please enter a Credential Name");
      return;
    }

    await writeContract({
      address: contractAddress,
      abi: institutionCredentialAbi,
      functionName: CONSTANTS.CONTRACT_FUNCTIONS.CREDENTIAL_TYPE_CREATION,
      args: [title, "testCid"],
    });

    return true;
    // }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCreating(true);

    const contractAddress = user?.issuer?.contract_address;
    if (!contractAddress) {
      alert(
        "No contract address found for the issuer, if you recently registered, please retry in a few minutes to allow time for your smart contract to deploy"
      );
      setIsCreating(false);
      return;
    }

    // Create JSON object from credential details
    const detailsJson = credentialDetails.reduce((acc, detail) => {
      if (detail.descriptor && detail.value) {
        acc[detail.descriptor] = detail.value;
      }
      return acc;
    }, {} as { [key: string]: string });

    try {
      // Wait for the transaction to complete
      onCreateInstitutionCredentialType(
        contractAddress as Address,
        credentialName,
        detailsJson
      );

      // Only clear form after successful transaction
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
      <HomeHeader showBackButton={true} />
      <Container sx={{ py: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h4" component="h1" align="center" gutterBottom>
              Create Credential
            </Typography>

            <form onSubmit={handleSubmit} noValidate>
              <Stack spacing={3}>
                <TextField
                  label="Credential Name"
                  variant="outlined"
                  value={credentialName}
                  onChange={(e) => setCredentialName(e.target.value)}
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
                <Button
                  type="button"
                  variant="outlined"
                  onClick={addCredentialDetail}
                >
                  + Add Credential Detail
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={isCreating}
                >
                  {isCreating ? "Creating Credential..." : "Create Credential"}
                </Button>
              </Stack>
            </form>

            <Box sx={{ mt: 3 }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate("/viewcredentials")}
                fullWidth
              >
                View Created Credentials
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
      <Typography variant="body1" align="center" sx={{ mt: 2 }}>
        {user?.issuer?.contract_address}
        {user?.issuer?.credential_types?.map((type) => type.name).join(", ")}
      </Typography>
    </>
  );
}
