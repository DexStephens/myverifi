import { Grid, Typography, Button, Modal, Box } from "@mui/material";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router";
import { CredentialIssueCard } from "./CredentialIssueCard";
import { useState } from "react";
import { CredentialIssue } from "../utils/user.util"; // Import the CredentialIssue type

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export function HolderDashboard() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [credentialIssues, setCredentialIssues] = useState<CredentialIssue[]>(user?.holder?.credential_issues || []);
  const [hiddenIssues, setHiddenIssues] = useState<CredentialIssue[]>([]);
  const [openHiddenModal, setOpenHiddenModal] = useState(false);

  if (!user || !user?.holder) {
    navigate("/login");
    return null;
  }

  const handleHideCard = (id: string) => {
    setCredentialIssues((prevIssues) => {
      const issueToHide = prevIssues.find((issue) => issue.id === Number(id));
      if (issueToHide) {
        setHiddenIssues((prevHidden) => [...prevHidden, issueToHide]);
      }
      return prevIssues.filter((issue) => issue.id !== Number(id));
    });
  };

  const handleUnhideCard = (id: string) => {
    setHiddenIssues((prevHidden) => {
      const issueToUnhide = prevHidden.find((issue) => issue.id === Number(id));
      if (issueToUnhide) {
        setCredentialIssues((prevIssues) => [...prevIssues, issueToUnhide]);
      }
      return prevHidden.filter((issue) => issue.id !== Number(id));
    });
  };

  return (
    <div>
      <Typography variant="h6">Welcome, {user.email}</Typography>
      <h1>Holder Dashboard</h1>
      {credentialIssues.length > 0 && (
        <Typography variant="h6" sx={{ p: 1, mt: 2 }}>
          Your Credentials
          <Grid container spacing={2} sx={{ p: 1, mt: 2 }}>
            {credentialIssues.map((credIssue) => (
              <Grid item xs={12} sm={6} md={4} key={credIssue.id}>
                <CredentialIssueCard
                  credentialIssue={credIssue}
                  onAction={() => handleHideCard(credIssue.id.toString())}
                  actionLabel="Hide"
                />
              </Grid>
            ))}
          </Grid>
        </Typography>
      )}
      <Button variant="contained" color="primary" onClick={() => setOpenHiddenModal(true)}>
        View Hidden Credentials
      </Button>
      <Modal
        open={openHiddenModal}
        onClose={() => setOpenHiddenModal(false)}
        aria-labelledby="hidden-credentials-modal-title"
        aria-describedby="hidden-credentials-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="hidden-credentials-modal-title" variant="h6" component="h2">
            Hidden Credentials
          </Typography>
          <Grid container spacing={2} sx={{ p: 1, mt: 2 }}>
            {hiddenIssues.map((credIssue) => (
              <Grid item xs={12} sm={6} md={4} key={credIssue.id}>
                <CredentialIssueCard
                  credentialIssue={credIssue}
                  onAction={() => handleUnhideCard(credIssue.id.toString())}
                  actionLabel="Unhide"
                />
              </Grid>
            ))}
          </Grid>
          <Button onClick={() => setOpenHiddenModal(false)} color="primary">
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
}