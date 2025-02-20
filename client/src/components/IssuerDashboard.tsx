import { Typography, Button } from "@mui/material";
import { useNavigate } from "react-router";
import { useAccount } from "wagmi";
import { WagmiConnectWallet } from "./WagmiConnectWallet";
import { useUser } from "../context/UserContext";
import Testing from "./Testing";

export function IssuerDashboard() {
  const { isConnected } = useAccount();
  const navigate = useNavigate();
  const { user } = useUser();

  const handleIssueCredential = () => {
    navigate("/issuecredential");
  };
  const handleCreateCredential = () => {
    navigate("/createcredential");
  };
  const handleViewCredentials = () => {
    navigate("/viewcredentials");
  };

  return (
    <div>
      <Typography variant="h6">Welcome, {user?.issuer?.name}</Typography>
      <h1>Issuer Dashboard</h1>
      <WagmiConnectWallet />
      <div>
        {isConnected ? (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateCredential}
            >
              Create Credential
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={handleIssueCredential}
            >
              Issue Credential
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={handleViewCredentials}
            >
              View Credentials
            </Button>
          </>
        ) : (
          <Typography variant="h6">
            Connect your wallet to issue credentials
          </Typography>
        )}
      </div>
      <Testing />
    </div>
  );
}
