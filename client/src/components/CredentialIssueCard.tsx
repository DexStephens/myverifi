import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
  Modal,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { CredentialIssue } from "../utils/user.util";
import { useEffect, useState } from "react";
import { publicClient } from "../utils/client";
import { institutionCredentialAbi } from "../utils/abi.util";
import { getJsonDataFromPinata } from "../utils/pinata.util";
import { useUser } from "../context/UserContext";

export function CredentialIssueCard({
  credentialIssue,
}: {
  credentialIssue: CredentialIssue;
}) {
  const [viewMoreDetails, setViewMoreDetails] = useState(false);
  const [moreDetails, setMoreDetails] = useState<JSON | object | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [hidden, setHidden] = useState(credentialIssue.hidden);
  const [saving, setSaving] = useState(false);
  const { fetchUserData } = useUser();

  useEffect(() => {
    const loadDetails = async () => {
      let pinataJson: JSON | null = null;
      if (credentialIssue.credential_type.issuer.contract_address) {
        const cid = (await publicClient.readContract({
          address: credentialIssue.credential_type.issuer.contract_address,
          abi: institutionCredentialAbi,
          functionName: "uri",
          args: [BigInt(credentialIssue.credential_type.token_id)],
        })) as string;

        pinataJson = await getJsonDataFromPinata(cid);
      }

      setMoreDetails(pinataJson ?? {});
      setLoadingDetails(false);
    };

    if (moreDetails === null && loadingDetails) {
      loadDetails();
    }
  }, [
    moreDetails,
    loadingDetails,
    credentialIssue.credential_type.issuer.contract_address,
    credentialIssue.credential_type.token_id,
  ]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/issuances/credentials/${credentialIssue.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...({ Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({ hidden }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update credential");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
      fetchUserData();
    }
  };

  return (
    <>
      <Modal
        open={viewMoreDetails}
        onClose={() => setViewMoreDetails(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          {moreDetails === null && loadingDetails ? (
            <p>Loading Credential Extra Details...</p>
          ) : (
            <p>
              {moreDetails !== null && Object.keys(moreDetails).length > 0 ? (
                <p>{JSON.stringify(moreDetails)}</p>
              ) : (
                <p>There are no extra details from the institution</p>
              )}
            </p>
          )}
        </Box>
      </Modal>
      <Card sx={{ minWidth: 375 }}>
        <CardContent>
          <Typography gutterBottom sx={{ color: "white" }}>
            {credentialIssue.credential_type.issuer.name}
          </Typography>
          <Typography variant="h5" component="div" sx={{ color: "white" }}>
            {credentialIssue.credential_type.name}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            onClick={() => setViewMoreDetails((current) => !current)}
            size="small"
            sx={{
              color: "white",
              "&:hover": {
                color: "success.main",
              },
              textDecoration: "underline",
            }}
          >
            View Details
          </Button>
          {/* Hide credential checkbox */}
          <FormControlLabel
            control={
              <Checkbox
                checked={hidden}
                onChange={(e) => setHidden(e.target.checked)}
                sx={{ color: "white" }}
              />
            }
            label="Hide credential"
            sx={{ color: "white" }}
          />
          {/* Save button with outline and conditional disabling */}
          <Button
            onClick={handleSave}
            disabled={saving || hidden === credentialIssue.hidden}
            variant="outlined"
            size="small"
            sx={{
              color: "white",
              borderColor: "white",
              "&:hover": {
                borderColor: "success.main",
                color: "success.main",
              },
            }}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </CardActions>
      </Card>
    </>
  );
}
