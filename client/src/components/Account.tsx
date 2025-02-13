import { useAccount, useDisconnect } from "wagmi";
import { Button, Typography } from "@mui/material";

export function Account() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  const formattedAddress = formatAddress(address);

  return (
    <>
      {location.pathname === "/register" ? (
        <Button
          variant="contained"
          color="primary"
          onClick={() => disconnect()}
          size="medium"
        >
          Disconnect Wallet
        </Button>
      ) : (
        <>
          <Typography variant="body1" sx={{ flexGrow: 1, ml: 2 }}>
            {formattedAddress}
          </Typography>{" "}
          <Button
            variant="contained"
            color="primary"
            onClick={() => disconnect()}
            size="medium"
          >
            Disconnect Wallet
          </Button>
        </>
      )}
    </>
  );
}

function formatAddress(address?: string) {
  if (!address) return null;
  return `${address}`;
}
