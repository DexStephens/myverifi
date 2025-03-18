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
} from "@mui/material";
import { useState } from "react";
import { useUser } from "../context/UserContext";
import IssueCredentialComponent from "../components/IssueCredentialComponent";
import CreateCredentialComponent from "../components/CreateCredentialComponent";
import CloseIcon from "@mui/icons-material/Close";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleIssueCredential = (credentialType: number | null) => {
    setSelectedCredentialType(credentialType);
    setOpenIssueModal(true);
  };

  const handleEdit = (credentialType: string) => {
    console.log(`Edit credential type: ${credentialType}`);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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
                View Details
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
                    Details
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
            onClose={() => setOpenIssueModal(false)}
          />
        </Box>
      </Modal>
    </Container>
  );
}