import { Typography, Button } from "@mui/material";
import { useNavigate } from "react-router";
import { useUser } from "../context/UserContext";

export function IssuerDashboard() {
  const navigate = useNavigate();
  const { user } = useUser();

  const handleIssueCredential = () => {
    navigate("/issuecredential");
  };
  const handleCreateCredential = () => {
    navigate("/createcredential");
  };
  const handleViewCredentials = () => {
    navigate("/viewcredentials");
  };

  return (
    <div>
      <Typography variant="h6">Welcome, {user?.issuer?.name}</Typography>
      <h1>Issuer Dashboard</h1>
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateCredential}
        >
          Create Credential
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={handleIssueCredential}
        >
          Issue Credential
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={handleViewCredentials}
        >
          View Credentials
        </Button>
      </div>
    </div>
  );
}
