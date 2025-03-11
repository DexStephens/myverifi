import {
  Typography,
  Button,
  Modal,
  Box,
  TableCell,
  TableRow,
  TableBody,
  Table,
  TableContainer,
  Container,
  TableHead,
  Paper,
} from "@mui/material";
import { useState } from "react";
import { useUser } from "../context/UserContext";
import IssueCredentialComponent from "../components/IssueCredentialComponent";
import CreateCredentialComponent from "../components/CreateCredentialComponent";
import "../styles/style.scss";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "auto",
  bgcolor: "transparent",
  boxShadow: "none",
  p: 0,
};

export function IssuerDashboard() {
  const { user } = useUser();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openIssueModal, setOpenIssueModal] = useState(false);
  const [selectedCredentialType, setSelectedCredentialType] = useState<
    number | null
  >(null);

  const handleIssueCredential = (credentialType: number | null) => {
    setSelectedCredentialType(credentialType);
    setOpenIssueModal(true);
  };

  const handleEdit = (credentialType: string) => {
    console.log(`Edit credential type: ${credentialType}`);
  };

  return (
    <Container sx={{ py: 4 }} maxWidth="md" className="fade-in">
      <Typography
        variant="h4"
        component="h1"
        align="center"
        gutterBottom
        color="primary"
      >
        {user?.issuer?.name}'s Credentials
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "center",
          mb: 3,
        }}
      >
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setOpenCreateModal(true)}
          sx={{ "&:hover": { backgroundColor: "success.main" } }}
        >
          Create Credential
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleIssueCredential(null)}
          sx={{ "&:hover": { backgroundColor: "success.main" } }}
        >
          Issue Credential
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow
              sx={{ backgroundColor: "primary.main", textAlign: "center" }}
            >
              <TableCell
                sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}
              >
                Credential Name
              </TableCell>
              <TableCell
                sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}
              >
                Edit
              </TableCell>
              <TableCell
                sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}
              >
                Issue
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {user?.issuer?.credential_types?.map((type, index) => (
              <TableRow key={index}>
                <TableCell sx={{ color: "white", textAlign: "left" }}>
                  {type.name}
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleEdit(type.name)}
                    sx={{
                      "&:hover": { backgroundColor: "success.main" },
                      display: "inline-block",
                    }}
                  >
                    Edit
                  </Button>
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleIssueCredential(type.id)}
                    sx={{
                      color: "white",
                      display: "inline-block",
                    }}
                  >
                    Issue
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        aria-labelledby="create-credential-modal-title"
        aria-describedby="create-credential-modal-description"
      >
        <Box sx={modalStyle}>
          <CreateCredentialComponent
            onClose={() => setOpenCreateModal(false)}
          />
        </Box>
      </Modal>

      <Modal
        open={openIssueModal}
        onClose={() => setOpenIssueModal(false)}
        aria-labelledby="issue-credential-modal-title"
        aria-describedby="issue-credential-modal-description"
      >
        <Box sx={modalStyle}>
          <IssueCredentialComponent
            credentialType={selectedCredentialType}
            onClose={() => setOpenIssueModal(false)}
          />
        </Box>
      </Modal>
    </Container>
  );
}
