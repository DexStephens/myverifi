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

export default function ViewCredentials({ onIssue }: { onIssue: (credentialType: string) => void }) {
  const { user } = useUser();

  const handleEdit = (credentialType: string) => {
    console.log(`Edit credential type: ${credentialType}`);
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
                  <Button variant="contained" color="secondary" onClick={() => onIssue(type.id.toString())}>
                    Issue
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
