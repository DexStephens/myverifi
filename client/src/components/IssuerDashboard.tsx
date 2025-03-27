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
  TextField,
  InputAdornment,
  IconButton,
  TablePagination,
  Link,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import IssueCredentialComponent from "../components/IssueCredentialComponent";
import CreateCredentialComponent from "../components/CreateCredentialComponent";
import CloseIcon from "@mui/icons-material/Close";
import "../styles/style.scss";
import { generateApiKey, revokeApiKey } from "../utils/apikey.util";

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

const loadingModalStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.2)", // Gray background with 20% opacity
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1300,
};

const statementBoxStyle = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  textAlign: "center",
  maxWidth: "400px",
  width: "90%",
  position: "relative",
  animation: "fade-in-out 5s ease-in-out",
};

export function IssuerDashboard() {
  const { user, fetchUserData } = useUser();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openIssueModal, setOpenIssueModal] = useState(false);
  const [selectedCredentialType, setSelectedCredentialType] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [loadingAnimation, setLoadingAnimation] = useState(false);
  const [currentStatement, setCurrentStatement] = useState(0);

  const statements = [
    "Preparing to issue the credential...",
    "Validating the credential details...",
    "Finalizing the issuance process...",
  ];

  const handleIssueCredential = (credentialType: number | null) => {
    setSelectedCredentialType(credentialType);
    setOpenIssueModal(true);
  };

  const triggerAnimation = () => {
    setLoadingAnimation(true);

    // Simulate the loading process
    setTimeout(() => {
      setLoadingAnimation(false);
      setOpenIssueModal(false);
      alert("Credential issued successfully!"); // Replace with actual logic
    }, statements.length * 5000); // Total time = 3 statements * 5 seconds each
  };

  const closeAnimationEarly = () => {
    setLoadingAnimation(false);
    setCurrentStatement(0); // Reset the statement index
  };

  useEffect(() => {
    if (loadingAnimation) {
      const interval = setInterval(() => {
        setCurrentStatement((prev) => prev + 1);
      }, 5000); // Change statement every 5 seconds

      return () => clearInterval(interval); // Cleanup interval on unmount
    } else {
      setCurrentStatement(0); // Reset statement index when animation ends
    }
  }, [loadingAnimation]);

  const handleEdit = (credentialType: string) => {
    console.log(`Edit credential type: ${credentialType}`);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredCredentials = user?.issuer?.credential_types?.filter((type) => {
    const searchLower = searchQuery.toLowerCase();
    const credentialName = type.name.toLowerCase();

    return credentialName.includes(searchLower);
  });

  const paginatedCredentials = filteredCredentials?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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

      <TextField
        fullWidth
        variant="outlined"
        size="medium"
        placeholder="Search by credential name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          endAdornment: searchQuery && (
            <InputAdornment position="end">
              <IconButton onClick={handleClearSearch} edge="end" size="small">
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
            {paginatedCredentials?.map((type, index) => (
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
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          sx={{
            color: "gray",
            "& .MuiSelect-icon": {
              color: "gray",
            },
          }}
          count={filteredCredentials?.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
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
            onIssue={triggerAnimation} // Pass the animation trigger as a prop
            onClose={() => setOpenIssueModal(false)}
          />
        </Box>
      </Modal>

      {/* Loading Animation Modal */}
      <Modal open={loadingAnimation} aria-labelledby="loading-modal">
        <Box sx={loadingModalStyle}>
          <Box sx={statementBoxStyle}>
            {/* Close Button */}
            <IconButton
              onClick={closeAnimationEarly}
              size="small"
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                color: "gray",
                "&:hover": { color: "error.main" },
              }}
            >
              <CloseIcon />
            </IconButton>

            {/* Statement */}
            <Typography variant="h6" color="primary">
              {statements[currentStatement]}
            </Typography>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
}