import { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import ContentCopy from "@mui/icons-material/ContentCopy";

export default function ApiDocumentation() {
  const [codeLang, setCodeLang] = useState<"curl" | "javascript" | "python">(
    "curl"
  );

  const handleLangChange = (
    _: any,
    newLang: "curl" | "javascript" | "python" | null
  ) => {
    if (newLang !== null) {
      setCodeLang(newLang);
    }
  };

  const codeExamples: Record<typeof codeLang, string> = {
    curl: `curl -X GET https://myverifi.com/api/listCredentials \\
  -H "Authorization: Bearer YOUR_API_KEY"`,

    javascript: `fetch("https://myverifi.com/api/listCredentials", {
  headers: {
    "Authorization": "Bearer YOUR_API_KEY"
  }
})
.then(response => response.json())
.then(data => console.log(data));`,

    python: `import requests

headers = {
  "Authorization": "Bearer YOUR_API_KEY"
}

response = requests.get("https://myverifi.com/api/listCredentials", headers=headers)
print(response.json())`,
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom color="primary">
        API Documentation
      </Typography>

      {/* Overview */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, color: "white" }}>
        <Typography variant="h5" gutterBottom>
          Overview
        </Typography>
        <Typography>
          Our API allows you to manage credentials programmatically. You can
          create, issue, and retrieve credentials using HTTP requests.
        </Typography>
      </Paper>

      {/* Authentication */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, color: "white" }}>
        <Typography variant="h5" gutterBottom>
          Authentication
        </Typography>
        <Typography>
          All API requests require an API key. Include your API key in the
          Authorization header as follows:
        </Typography>
        <Box sx={{ position: "relative", mt: 2 }}>
          <Box
            component="pre"
            sx={{
              bgcolor: "#f5f5f5",
              p: 2,
              borderRadius: 1,
              color: "black",
              overflow: "auto",
            }}
          >
            {`Authorization: Bearer YOUR_API_KEY`}
          </Box>
          <IconButton
            onClick={() =>
              navigator.clipboard.writeText(
                "Authorization: Bearer YOUR_API_KEY"
              )
            }
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "#555",
              bgcolor: "transparent",
              "&:hover": { bgcolor: "#eee" },
            }}
            size="small"
          >
            <ContentCopy fontSize="small" />
          </IconButton>
        </Box>
      </Paper>

      {/* Endpoints */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, color: "white" }}>
        <Typography variant="h5" gutterBottom>
          Endpoints
        </Typography>

        <Typography variant="h6" sx={{ mt: 2 }}>
          For Issuers
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="GET /api/listCredentials"
              secondary="Fetch a list of all credentials."
              secondaryTypographyProps={{ sx: { color: "white" } }}
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="POST /api/createCredential"
              secondary="Create a new credential with a title and attributes."
              secondaryTypographyProps={{ sx: { color: "white" } }}
            />
            <ListItemText
              secondary={
                <Box
                  component="pre"
                  sx={{
                    bgcolor: "#f5f5f5",
                    p: 2,
                    borderRadius: 1,
                    color: "black",
                    overflow: "auto",
                    whiteSpace: "pre-wrap",
                    maxHeight: 300,
                  }}
                >
                  {`{
 "title": "My New Credential",
 "attributes": {
    "key1": "value1",
    "key2": "value2"
  }
}`}
                </Box>
              }
            />
          </ListItem>
        </List>

        <Typography variant="h6" sx={{ mt: 4 }}>
          For Verifiers
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="GET /api/credentials/:id"
              secondary="Retrieve a specific credential by ID for verification."
              secondaryTypographyProps={{ sx: { color: "white" } }}
            />
          </ListItem>
        </List>
      </Paper>

      {/* Example Request */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, color: "white" }}>
        <Typography variant="h5" gutterBottom>
          Example Request
        </Typography>

        {/* Language toggle buttons */}
        <ToggleButtonGroup
          value={codeLang}
          exclusive
          onChange={handleLangChange}
          size="small"
          sx={{ mb: 2 }}
        >
          {["curl", "javascript", "python"].map((lang) => (
            <ToggleButton
              key={lang}
              value={lang}
              sx={{
                color: "white",
                borderColor: "white",
                "&.Mui-selected": {
                  color: "#000",
                  bgcolor: "white",
                  "&:hover": {
                    bgcolor: "#ddd",
                  },
                },
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Box sx={{ position: "relative" }}>
          <IconButton
            onClick={() =>
              navigator.clipboard.writeText(codeExamples[codeLang])
            }
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "#555",
              bgcolor: "transparent",
              "&:hover": { bgcolor: "#eee" },
            }}
            size="small"
          >
            <ContentCopy fontSize="small" />
          </IconButton>

          <Box
            component="pre"
            sx={{
              bgcolor: "#f5f5f5",
              p: 2,
              borderRadius: 1,
              color: "black",
              overflow: "auto",
              whiteSpace: "pre-wrap",
              maxHeight: 300,
            }}
          >
            {codeExamples[codeLang]}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
