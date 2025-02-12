import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from "wagmi";
import { Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router";
import Testing from "./Testing";

export function Account() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });
  const location = useLocation();

  const formattedAddress = formatAddress(address);

  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/dashboard");
  };

  return (
    <div className="row">
      <Testing />
      <div className="inline">
        {ensAvatar ? (
          <img alt="ENS Avatar" className="avatar" src={ensAvatar} />
        ) : (
          <div className="avatar" />
        )}
        <div className="stack">
          {address && (
            <div className="text">
              {ensName ? `${ensName} (${formattedAddress})` : formattedAddress}
            </div>
          )}
        </div>
      </div>
      {location.pathname === "/dashboard" ? (
        <Button
          variant="contained"
          color="primary"
          onClick={() => disconnect()}
          size="medium"
        >
          Disconnect Wallet
        </Button>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={handleContinue}
          size="large"
        >
          Continue
        </Button>
      )}
    </div>
  );
}

function formatAddress(address?: string) {
  if (!address) return null;
  return `${address}`;
}
