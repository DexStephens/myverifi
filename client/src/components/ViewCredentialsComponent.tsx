import { useUser } from "../context/UserContext";
import {
  Typography,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router";

export default function ViewCredentials() {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleEdit = (credentialType: string) => {
    // Implement the logic to edit the credential type
    console.log(`Edit credential type: ${credentialType}`);
  };

  const handleIssue = (credentialType: string) => {
    // Navigate to the issue credential page
    console.log(`Issue credential type: ${credentialType}`);
  };

  return (
    <Container sx={{ py: 4 }} maxWidth="md">
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Saved Credentials
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Credential Name</TableCell>
              <TableCell>Edit</TableCell>
              <TableCell>Issue</TableCell>
              {/* Add more table headers if needed */}
            </TableRow>
          </TableHead>
          <TableBody>
            {user?.issuer?.credential_types?.map((type, index) => (
              <TableRow key={index}>
                <TableCell>{type.name}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleEdit(type.name)}>
                    Edit
                  </Button>
                </TableCell>
                <TableCell>
                  <Button variant="contained" color="secondary" onClick={() =>handleIssue(`${index + 1}n`)}>
                    Issue
                  </Button>
                </TableCell>
                {/* Add more table cells if needed */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
