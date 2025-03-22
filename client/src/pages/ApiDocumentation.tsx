import { Container, Typography, Box, Paper, List, ListItem, ListItemText, Divider } from "@mui/material";

export default function ApiDocumentation() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom color="primary">
        API Documentation
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Overview
        </Typography>
        <Typography>
          Our API allows you to manage credentials programmatically. You can create, issue, and retrieve credentials using HTTP requests.
        </Typography>
      </Paper>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Authentication
        </Typography>
        <Typography>
          All API requests require an API key. Include your API key in the Authorization header as follows:
        </Typography>
        <Box component="pre" sx={{ bgcolor: "#f5f5f5", p: 2, borderRadius: 1, mt: 2 }}>
          {`Authorization: Bearer YOUR_API_KEY`}
        </Box>
      </Paper>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Endpoints
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="GET /api/credentials"
              secondary="Fetch a list of all credentials."
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="POST /api/credentials"
              secondary="Create a new credential. Requires a valid API key."
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="POST /api/credentials/:id/issue"
              secondary="Issue a credential by ID. Requires a valid API key."
            />
          </ListItem>
        </List>
      </Paper>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Example Request
        </Typography>
        <Box component="pre" sx={{ bgcolor: "#f5f5f5", p: 2, borderRadius: 1, mt: 2 }}>
          {`curl -X GET https://yourapi.com/api/credentials \
  -H "Authorization: Bearer YOUR_API_KEY"`}
        </Box>
      </Paper>
    </Container>
  );
}
