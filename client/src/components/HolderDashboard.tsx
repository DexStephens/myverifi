import { Container, Stack, Typography, TextField, Box } from "@mui/material";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router";
import { CredentialIssueCard } from "./CredentialIssueCard";
import { useState } from "react";

export function HolderDashboard() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");

  if (!user || !user?.holder) {
    navigate("/login");
    return;
  }

  const filteredCredentials = user.holder.credential_issues.filter(
    (credIssue) => {
      const searchLower = searchQuery.toLowerCase();
      const issuerName = credIssue.credential_type.issuer.name.toLowerCase();
      const credentialName = credIssue.credential_type.name.toLowerCase();

      return (
        issuerName.includes(searchLower) || credentialName.includes(searchLower)
      );
    }
  );

  return (
    <Container sx={{ py: 4 }} maxWidth="md" className="fade-in">
      <Stack spacing={3}>
        <Typography
          variant="h4"
          component="h1"
          align="center"
          gutterBottom
          color="primary"
        >
          Your Credentials
        </Typography>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by institution or credential name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "white",
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "secondary.main",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "secondary.main",
              },
            },
          }}
        />

        {filteredCredentials.length > 0 ? (
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            useFlexGap
            flexWrap="wrap"
          >
            {filteredCredentials.map((credIssue) => (
              <CredentialIssueCard
                key={credIssue.id}
                credentialIssue={credIssue}
              />
            ))}
          </Stack>
        ) : (
          <Typography align="center" color="primary">
            {searchQuery
              ? "No credentials match your search"
              : "You don't have any credentials yet"}
          </Typography>
        )}
      </Stack>
    </Container>
  );
}
