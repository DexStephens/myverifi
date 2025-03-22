import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Register from "./pages/Register.tsx";
import { UserProvider } from "./context/UserContext.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import VerifyCredentials from "./pages/VerifyCredentials.tsx";
import Layout from "./components/Layout.tsx";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/theme.ts";
import { CssBaseline } from "@mui/material";
import ApiDocumentation from "./pages/ApiDocumentation.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
              <Route path="api-docs" element={<ApiDocumentation />} />
            </Route>
          </Routes>
        </UserProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
