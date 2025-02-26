import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./pages/Login.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Register from "./pages/Register.tsx";
import IssueCredential from "./pages/IssueCredential.tsx";
import CreateCredential from "./pages/CreateCredential.tsx";
import ViewCredentials from "./pages/ViewCredentials.tsx";
import { WagmiProvider } from "wagmi";
import { config } from "./components/WagmiConfig.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "./context/UserContext.tsx";
import VerifyCredentials from "./pages/VerifyCredentials.tsx";

const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/verify" element={<VerifyCredentials />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/issuecredential" element={<IssueCredential />} />
              <Route path="/createcredential" element={<CreateCredential />} />
              <Route path="/viewcredentials" element={<ViewCredentials />} />
            </Routes>
          </QueryClientProvider>
        </WagmiProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
);
