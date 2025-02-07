import { WagmiConnectWallet } from "../components/WagmiConnectWallet";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router";
import { Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import HomeHeader from "../components/HomeHeader";

export interface WebUserLoginResponse {
  email: string;
  title: string;
  street_address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}

export default function Dashboard() {
  const { isConnected } = useAccount();
  const navigate = useNavigate();
  const [user, setUser] = useState<WebUserLoginResponse | null>(null);

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) {
      setUser(JSON.parse(user));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleIssueCredential = () => {
    navigate("/issuecredential");
  };

  return (
    <>
      <HomeHeader />
      <div>
        <Typography variant="h6">Welcome, {user?.title}</Typography>

        <h1>Your Dashboard</h1>
        <WagmiConnectWallet />
      </div>
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
    </>
  );
}
