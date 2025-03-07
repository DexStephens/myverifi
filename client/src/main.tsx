import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Register from "./pages/Register.tsx";
import IssueCredential from "./pages/IssueCredential.tsx";
import CreateCredential from "./pages/CreateCredential.tsx";
import ViewCredentials from "./pages/ViewCredentials.tsx";
import { UserProvider } from "./context/UserContext.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import BatchSendCredentials from "./pages/BatchSendCredentials.tsx";
import VerifyCredentials from "./pages/VerifyCredentials.tsx";
import Layout from "./components/Layout.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
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
              path="issuecredential/:credentialType?"
              element={
                <ProtectedRoute>
                  <IssueCredential />
                </ProtectedRoute>
              }
            />
            <Route path="createcredential" element={<CreateCredential />} />
            <Route path="viewcredentials" element={<ViewCredentials />} />
          </Route>
        </Routes>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
);
