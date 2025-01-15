import "./App.css";
import { useState } from "react";
import HardhatConnection from "./components/HardhatConnection";
import MetamaskConnection from "./components/MetamaskConnection";

function App() {
  const [viewState, setViewState] = useState<"metamask" | "hardhat" | null>(
    null
  );
  return (
    <>
      <h1>myverifi</h1>
      {viewState === null ? (
        <>
          <button onClick={() => setViewState("hardhat")}>
            Connect to hardhat network
          </button>
          <button onClick={() => setViewState("metamask")}>
            Connect to metamask wallet
          </button>
        </>
      ) : viewState === "hardhat" ? (
        <HardhatConnection />
      ) : (
        <MetamaskConnection />
      )}
    </>
  );
}

export default App;
