import { Typography, Button } from "@mui/material";
import { useNavigate } from "react-router";
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
  const navigate = useNavigate();
  const { user } = useUser();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openIssueModal, setOpenIssueModal] = useState(false);


  return (
    <div>
      <Typography variant="h6">Welcome, {user?.issuer?.name}</Typography>
      <h1>Issuer Dashboard</h1>
      <div>
          <>
            <Button variant="contained" color="primary" onClick={() => setOpenCreateModal(true)}>
              Create Credential
            </Button>
            <Button variant="contained" color="secondary" onClick={() => setOpenIssueModal(true)}>
              Issue Credential
            </Button>

            <ViewCredentialsComponent />

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
                <IssueCredentialComponent />
              </Box>
            </Modal>
          </>
         : (
          <Typography variant="h6">
            Connect your wallet to issue credentials
          </Typography>
        )
      </div>
    </div>
  );
}
