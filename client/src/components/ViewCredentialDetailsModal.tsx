import { useState, useEffect } from "react";
import { institutionCredentialAbi } from "../utils/abi.util";
import { publicClient } from "../utils/client";
import { getJsonDataFromPinata } from "../utils/pinata.util";
import {
  Modal,
  Box,
  CircularProgress,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { Address } from "viem";

export function ViewCredentialDetailsModal({
  viewDetails,
  setViewDetails,
  tokenId,
  contractAddress,
  fromInstitution = false,
}: {
  viewDetails: boolean;
  setViewDetails: (viewDetails: boolean) => void;
  tokenId: string;
  contractAddress: Address;
  fromInstitution?: boolean;
}) {
  const [moreDetails, setMoreDetails] = useState<JSON | object | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      let pinataJson: JSON | null = null;
      if (contractAddress) {
        const cid = (await publicClient.readContract({
          address: contractAddress,
          abi: institutionCredentialAbi,
          functionName: "uri",
          args: [BigInt(tokenId.replace(/n$/, ""))],
        })) as string;

        console.log("CID", cid);
        if (cid && !cid.includes("default")) {
          pinataJson = await getJsonDataFromPinata(cid);
        }

        setMoreDetails(pinataJson ?? {});
        setLoadingDetails(false);
      }
    };

    if (moreDetails === null && loadingDetails) {
      loadDetails();
    }
  }, [moreDetails, loadingDetails, contractAddress, tokenId]);

  return (
    <Modal
      open={viewDetails}
      onClose={() => setViewDetails(false)}
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
        onClick={() => setViewDetails(false)}
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
                  There are no extra details
                  {fromInstitution ? "" : " from the institution"}.
                </Typography>
              )}
            </CardContent>
          </Card>
        )}
      </Box>
    </Modal>
  );
}
