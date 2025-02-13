import { Typography } from "@mui/material";
import { WagmiConnectWallet } from "./WagmiConnectWallet";
import { useUser } from "../context/UserContext";

export function HolderDashboard() {
  const { user } = useUser();

  return (
    <div>
      <Typography variant="h6">Welcome, {user?.email}</Typography>
      <h1>Holder Dashboard</h1>
      <WagmiConnectWallet />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Your Credentials: {user?.holder?.credential_issues?.length ?? 0}
      </Typography>
    </div>
  );
}
