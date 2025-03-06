import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Register from "./pages/Register.tsx";
import { WagmiProvider } from "wagmi";
import { config } from "./components/WagmiConfig.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "./context/UserContext.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import BatchSendCredentials from "./pages/BatchSendCredentials.tsx";
import VerifyCredentials from "./pages/VerifyCredentials.tsx";
import Layout from "./components/Layout.tsx";

const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<App />} />
                <Route path="verify" element={<VerifyCredentials />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route
                  path="dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="batchsend"
                  element={
                    <ProtectedRoute>
                      <BatchSendCredentials />
                    </ProtectedRoute>
                  }
                />
              </Route>
            </Routes>
          </QueryClientProvider>
        </WagmiProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
);
