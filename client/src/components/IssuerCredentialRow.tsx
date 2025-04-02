import { TableRow, TableCell, Button } from "@mui/material";
import { Address } from "viem";
import { ViewCredentialDetailsModal } from "./ViewCredentialDetailsModal";
import { CredentialType } from "../utils/user.util";
import { useState } from "react";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import PageviewRoundedIcon from "@mui/icons-material/PageviewRounded";

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
          }}
        >
          <PageviewRoundedIcon />
        </Button>
      </TableCell>
      <TableCell align="center">
        <Button
          variant="contained"
          color="success"
          onClick={() => handleIssueCredential(type.id)}
          sx={{
            color: "white",
          }}
        >
          <SendRoundedIcon />
        </Button>
      </TableCell>
    </TableRow>
  );
}
