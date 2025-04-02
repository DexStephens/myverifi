import { Stack, Box, Typography, Button } from "@mui/material";
import { Link } from "react-router";
import backgroundPic from "../../../assets/myverifiHome.png";
import { useNavigate } from "react-router";
import { useUser } from "../../context/UserContext";

export default function CallToActionComponent() {
  const navigate = useNavigate();
  const { user } = useUser();

  const handleGetVerified = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/register");
    }
  };

  return (
    <Stack spacing={2} alignItems="center" textAlign="center">
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          padding: "0px 0", // Adjusted padding to reduce space
        }}
      >
        <Box
          component="img"
          src={backgroundPic}
          alt="myverifi Landing"
          sx={{
            width: "55%",
            height: "auto",
          }}
        />
      </Box>
      <Typography variant="h2" component="h1" color="primary">
        myverifi
      </Typography>
      <Typography variant="h5" component="p" color="primary">
        Instant verification. Secure transactions. Controlled data.
      </Typography>
      <Stack direction="row" spacing={2} p={2}>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={handleGetVerified}
          sx={{
            "&:hover": {
              backgroundColor: "success.main",
            },
          }}
        >
          Get Verified
        </Button>
        <Button
          component={Link}
          to="/verify"
          variant="contained"
          color="secondary"
          size="large"
          sx={{
            "&:hover": {
              backgroundColor: "success.main",
            },
          }}
        >
          Verify Credentials
        </Button>
      </Stack>
    </Stack>
  );
}
