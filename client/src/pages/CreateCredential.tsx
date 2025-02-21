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

    writeContract({
      address: contractAddress,
      abi: institutionCredentialAbi,
      functionName: CONSTANTS.CONTRACT_FUNCTIONS.CREDENTIAL_TYPE_CREATION,
      args: [title, "testCid"],
    });
    // }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const contractAddress = user?.issuer?.contract_address;
    if (!contractAddress) {
      alert(
        "No contract address found for the issuer, if you recently registered, please retry in a few minutes to allow time for your smart contract to deploy"
      );
      return;
    }

    // Create JSON object from credential details
    const detailsJson = credentialDetails.reduce((acc, detail) => {
      if (detail.descriptor && detail.value) {
        acc[detail.descriptor] = detail.value;
      }
      return acc;
    }, {} as { [key: string]: string });

    console.log("Form Data:");
    console.log("Credential Name:", credentialName);
    console.log("Credential Details:", detailsJson);
    console.log("Contract Address:", contractAddress);

    try {
      onCreateInstitutionCredentialType(
        contractAddress as Address,
        credentialName,
        detailsJson
      );
      //Display an aesthetic success message to the user and clear the form
      alert("Credential Created Successfully");
      setCredentialName("");
      setCredentialDetails([]);
    } catch (error) {
      console.error("Error Creating Credential:", error);
      alert("An error occurred while creating the credential");
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
                >
                  Create Credential
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
//,{user?.issuer?.credential_types}
//event CredentialCreated(string name, uint256 tokenId, address institution);

// function createCredentialType(string memory name) external onlyOwner {
//   uint256 tokenId = _nextTokenId++;
//   tokenIds[tokenId] = name;
//   emit CredentialCreated(name, tokenId, msg.sender);
// }

// async function onCreateInstitutionCredentialType(
//   contractAddress: Address,
//   title: string
// ) {
//   writeContract({
//     address: contractAddress,
//     abi: institutionCredentialAbi,
//     functionName: CONSTANTS.CONTRACT_FUNCTIONS.CREDENTIAL_TYPE_CREATION,
//     args: [title],
//   });
// }

// model CredentialType {
//   id              Int              @id @default(autoincrement())
//   name            String
//   token_id        BigInt
//   issuer_id       Int
//   issuer          Issuer      @relation(fields: [issuer_id], references: [id])
//   // A credential type can be assigned to many holders via issuance
//   credential_issues CredentialIssue[]
// }

// model User {
//   id                Int                @id @default(autoincrement())
//   email             String             @unique
//   password_hash     String
//   address           String?

//   // One-to-one relation fields with either role
//   holder            Holder?
//   issuer            Issuer?
// }

// model Issuer {
//   id                Int                @id @default(autoincrement())
//   userId            Int                @unique
//   user              User               @relation(fields: [userId], references: [id])
//   name              String
//   contract_address  String?
//   // An institution can issue several credential types
//   credential_types  CredentialType[]
// }

// async function onCreateInstitutionCredentialType(
//   contractAddress: Address,
//   title: string,
//   jsonData: object
// ) {
//   //First need to upload jsonData to pinata to get a cid to upload to the contract
//   const cid = await uploadJsonToPinata(title, jsonData);

//   //If successful, then we can create the credential type on our contract
//   if (cid !== null) {
//     writeContract({
//       address: contractAddress,
//       abi: institutionCredentialAbi,
//       functionName: CONSTANTS.CONTRACT_FUNCTIONS.CREDENTIAL_TYPE_CREATION,
//       args: [title, cid],
//     });
//   }
// }
