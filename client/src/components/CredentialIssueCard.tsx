import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import { CredentialIssue } from "../utils/user.util";
import { useState } from "react";
import { useUser } from "../context/UserContext";
import { ViewCredentialDetailsModal } from "./ViewCredentialDetailsModal";

export function CredentialIssueCard({
  credentialIssue,
}: {
  credentialIssue: CredentialIssue;
}) {
  const [viewMoreDetails, setViewMoreDetails] = useState(false);
  const [hidden, setHidden] = useState(credentialIssue.hidden);
  const [saving, setSaving] = useState(false);
  const { fetchUserData } = useUser();

  const handleToggleHidden = async () => {
    setSaving(true);
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/issuances/credentials/${
          credentialIssue.id
        }`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...{ Authorization: `Bearer ${token}` },
          },
          body: JSON.stringify({ hidden: !hidden }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update credential");
      }
      setHidden(!hidden);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
      fetchUserData();
    }
  };

  return (
    <>
      <ViewCredentialDetailsModal
        viewDetails={viewMoreDetails}
        setViewDetails={setViewMoreDetails}
        tokenId={credentialIssue.credential_type.token_id}
        contractAddress={
          credentialIssue.credential_type.issuer.contract_address
        }
      />
      <Card sx={{ display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom sx={{ color: "white" }}>
            {credentialIssue.credential_type.issuer.name}
          </Typography>
          <Typography variant="h5" component="div" sx={{ color: "white" }}>
            {credentialIssue.credential_type.name}
          </Typography>
        </CardContent>
        <CardActions sx={{ mt: "auto" }}>
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
          <Button
            onClick={handleToggleHidden}
            disabled={saving}
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
            {saving ? "Saving..." : hidden ? "Unhide" : "Hide"}
          </Button>
        </CardActions>
      </Card>
    </>
  );
}
