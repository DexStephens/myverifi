import * as React from "react";
import { Connector, useChainId, useConnect } from "wagmi";
import { Button } from "@mui/material";

export function Connect() {
  const chainId = useChainId();
  const { connectors, connect } = useConnect();

  return (
    <div className="buttons">
      {connectors.map((connector) => (
        <ConnectorButton
          key={connector.uid}
          connector={connector}
          onClick={() => connect({ connector, chainId })}
        />
      ))}
    </div>
  );
}

function ConnectorButton({
  connector,
  onClick,
}: {
  connector: Connector;
  onClick: () => void;
}) {
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    (async () => {
      const provider = await connector.getProvider();
      setReady(!!provider);
    })();
  }, [connector, setReady]);

  return (
    <Button
      variant="contained"
      color="primary"
      disabled={!ready}
      onClick={onClick}
    >
      Connect Wallet
    </Button>
  );
}
