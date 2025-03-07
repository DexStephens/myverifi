import { Grid, Typography } from "@mui/material";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router";
import { CredentialIssueCard } from "./CredentialIssueCard";

export function HolderDashboard() {
  const navigate = useNavigate();
  const { user } = useUser();

  if (!user || !user?.holder) {
    navigate("/login");
    return;
  }

  return (
    <div>
      <Typography variant="h6">Welcome, {user.email}</Typography>
      <h1>Holder Dashboard</h1>
      {user.holder.credential_issues.length && (
        <Typography variant="h6" sx={{ p: 1, mt: 2 }}>
          Your Credentials
          <Grid container spacing={2} sx={{ p: 1, mt: 2 }}>
            {user.holder.credential_issues.map((credIssue) => (
              <Grid item xs={12} sm={6} md={4} key={credIssue.id}>
                <CredentialIssueCard credentialIssue={credIssue} />
              </Grid>
            ))}
          </Grid>
        </Typography>
      )}
    </div>
  );
}
