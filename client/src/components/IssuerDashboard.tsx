import { Typography, Button } from "@mui/material";
import { useNavigate } from "react-router";
import { useAccount } from "wagmi";
import { WagmiConnectWallet } from "./WagmiConnectWallet";
import { useUser } from "../context/UserContext";

export function IssuerDashboard() {
  const { isConnected } = useAccount();
  const navigate = useNavigate();
  const { user } = useUser();

  const handleIssueCredential = () => {
    navigate("/issuecredential");
  };

  return (
    <div>
      <Typography variant="h6">Welcome, {user?.issuer?.name}</Typography>
      <h1>Issuer Dashboard</h1>
      <WagmiConnectWallet />
      <div>
        {isConnected ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleIssueCredential}
          >
            Issue Credential
          </Button>
        ) : (
          <Typography variant="h6">
            Connect your wallet to issue credentials
          </Typography>
        )}
      </div>
    </div>
  );
}
