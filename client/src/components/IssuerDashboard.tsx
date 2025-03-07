import { Typography, Button, Modal, Box } from "@mui/material";
import { useState } from "react";
import { useUser } from "../context/UserContext";
import IssueCredentialComponent from "../components/IssueCredentialComponent";
import CreateCredentialComponent from "../components/CreateCredentialComponent";
import ViewCredentialsComponent from "../components/ViewCredentialsComponent";

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'auto',
  bgcolor: 'transparent',
  boxShadow: 'none',
  p: 0,
};

export function IssuerDashboard() {
  const { user } = useUser();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openIssueModal, setOpenIssueModal] = useState(false);
  const [selectedCredentialType, setSelectedCredentialType] = useState<string | null>(null);

  const handleIssueCredential = (credentialType: string) => {
    setSelectedCredentialType(credentialType);
    setOpenIssueModal(true);
  };

  return (
    <div>
      <Typography variant="h6">Welcome, {user?.issuer?.name}</Typography>
      <h1>Issuer Dashboard</h1>
      <div>
        <Button variant="contained" color="primary" onClick={() => setOpenCreateModal(true)}>
          Create Credential
        </Button>
        <Button variant="contained" color="secondary" onClick={() => handleIssueCredential("")}>
          Issue Credential
        </Button>
        
        <ViewCredentialsComponent onIssue={handleIssueCredential} />

        <Modal
          open={openCreateModal}
          onClose={() => setOpenCreateModal(false)}
          aria-labelledby="create-credential-modal-title"
          aria-describedby="create-credential-modal-description"
        >
          <Box sx={modalStyle}>
            <CreateCredentialComponent />
          </Box>
        </Modal>

        <Modal
          open={openIssueModal}
          onClose={() => setOpenIssueModal(false)}
          aria-labelledby="issue-credential-modal-title"
          aria-describedby="issue-credential-modal-description"
        >
          <Box sx={modalStyle}>
            <IssueCredentialComponent credentialType={selectedCredentialType} />
          </Box>
        </Modal>
      </div>
    </div>
  );
}
