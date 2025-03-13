import {
  Container,
  Stack,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router";
import { CredentialIssueCard } from "./CredentialIssueCard";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

export function HolderDashboard() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");

  if (!user || !user?.holder) {
    navigate("/login");
    return;
  }

  const handleClearSearch = () => {
    setSearchQuery("");
  };

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

  const visibleCredentials = filteredCredentials.filter((credIssue) => !credIssue.hidden);
  const hiddenCredentials = filteredCredentials.filter((credIssue) => credIssue.hidden);

  return (
    <Container sx={{ py: 4, maxWidth: '900px' }} className="fade-in">
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
          size="medium"
          placeholder="Search by institution or credential name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClearSearch}
                  edge="end"
                  size="small"
                >
                  <CloseIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "white",
              "& fieldset": {
                borderColor: "secondary.main",
                borderWidth: "2px",
              },
              "&:hover fieldset": {
                borderColor: "success.main",
                borderWidth: "2px",
              },
              "&.Mui-focused fieldset": {
                borderColor: "success.main",
                borderWidth: "2px",
              },
              "& input": {
                color: "secondary.main",
              },
              "& input::placeholder": {
                color: "secondary.main",
                opacity: 1,
              },
            },
            "& .MuiIconButton-root": {
              color: "secondary.main",
              "&:hover": {
                color: "error.main",
              },
            },
          }}
        />

        {visibleCredentials.length > 0 ? (
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.68}
            useFlexGap
            flexWrap="wrap"
            sx={{
              "& > *": {
                flexBasis: {
                  xs: "100%",
                  sm: "calc(50% - 8px)",
                  md: "calc(33.333% - 10.667px)",
                },
                minWidth: 0,
              },
            }}
          >
            {visibleCredentials.map((credIssue) => (
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

        <Typography
          variant="h4"
          component="h3"
          align="center"
          gutterBottom
          color="secondary"
        >
          Hidden Credentials
        </Typography>
        {hiddenCredentials.length > 0 ? (
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            useFlexGap
            flexWrap="wrap"
            sx={{
              "& > *": {
                flexBasis: {
                  xs: "100%",
                  sm: "calc(50% - 8px)",
                  md: "calc(33.333% - 10.667px)",
                },
                minWidth: 0,
              },
            }}
          >
            {hiddenCredentials.map((credIssue) => (
              <CredentialIssueCard
                key={credIssue.id}
                credentialIssue={credIssue}
              />
            ))}
          </Stack>
        ) : (
          <Typography align="center" color="primary">
            {searchQuery
              ? "No hidden credentials match your search"
              : "You don't have any hidden credentials"}
          </Typography>
        )}
      </Stack>
    </Container>
  );
}