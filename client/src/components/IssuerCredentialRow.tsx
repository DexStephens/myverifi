import { TableRow, TableCell, Button } from "@mui/material";
import { Address } from "viem";
import { ViewCredentialDetailsModal } from "./ViewCredentialDetailsModal";
import { CredentialType } from "../utils/user.util";
import { useState } from "react";

export function IssuerCredentialRow({
  type,
  contractAddress,
  handleIssueCredential,
}: {
  type: CredentialType;
  contractAddress: Address;
  handleIssueCredential: (credentialType: number | null) => void;
}) {
  const [viewDetails, setViewDetails] = useState(false);

  return (
    <TableRow>
      <ViewCredentialDetailsModal
        viewDetails={viewDetails}
        setViewDetails={setViewDetails}
        tokenId={type.token_id}
        contractAddress={contractAddress}
        fromInstitution={true}
      />
      <TableCell sx={{ color: "white", textAlign: "left" }}>
        {type.name}
      </TableCell>
      <TableCell align="center">
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setViewDetails(true)}
          sx={{
            "&:hover": { backgroundColor: "success.main" },
            display: "inline-block",
          }}
        >
          Details
        </Button>
      </TableCell>
      <TableCell align="center">
        <Button
          variant="contained"
          color="success"
          onClick={() => handleIssueCredential(type.id)}
          sx={{
            color: "white",
            display: "inline-block",
          }}
        >
          Issue
        </Button>
      </TableCell>
    </TableRow>
  );
}
