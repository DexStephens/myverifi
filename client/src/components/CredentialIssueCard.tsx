import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
  Modal,
  CircularProgress,
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
          args: [
            BigInt(credentialIssue.credential_type.token_id.replace(/n$/, "")),
          ],
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

  const handleToggleHidden = async () => {
    setSaving(true);
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/issuances/credentials/${credentialIssue.id}`,
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
      <Modal
        open={viewMoreDetails}
        onClose={() => setViewMoreDetails(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
          onClick={() => setViewMoreDetails(false)}
        >
          {moreDetails === null && loadingDetails ? (
            <CircularProgress />
          ) : (
            <Card
              sx={{
                width: "100%",
                maxWidth: 500,
                bgcolor: "white",
                boxShadow: 3,
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Additional Information
                </Typography>

                {moreDetails !== null && Object.keys(moreDetails).length > 0 ? (
                  Object.entries(moreDetails).map(([key, value]) => (
                    <Box key={key} sx={{ display: "flex", gap: 1, py: 0.5 }}>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        sx={{ textTransform: "capitalize" }}
                      >
                        {key}:
                      </Typography>
                      <Typography variant="body2">{String(value)}</Typography>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    There are no extra details from the institution.
                  </Typography>
                )}
              </CardContent>
            </Card>
          )}
        </Box>
      </Modal>
      <Card sx={{ minWidth: 375, display: "flex", flexDirection: "column" }}>
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
