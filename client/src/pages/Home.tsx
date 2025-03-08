import {
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  Divider,
} from "@mui/material";
import { Link, useNavigate } from "react-router";
import HomeSection from "../components/HomeSection";
import "../styles/style.scss";
import { useUser } from "../context/UserContext";

export default function Home() {
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
    <div className="home-wrapper">
      {/* Call to Action Section */}
      <HomeSection>
        <Stack spacing={4} alignItems="center" textAlign="center">
          <Typography variant="h2" component="h1" color="primary">
            myverifi
          </Typography>
          <Typography variant="h5" component="p" color="primary">
            Instant verification. Secure transactions. Controlled data.
          </Typography>
          <Stack direction="row" spacing={2}>
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
      </HomeSection>

      {/* Card Section for More Info */}
      <HomeSection>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          sx={{ width: "100%", px: 4 }}
        >
          <Card>
            <CardContent>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                color="white"
              >
                Comprehensive Verification
              </Typography>
              <Typography variant="body2" component="p" color="white">
                Our advanced verification process ensures the highest level of
                accuracy and reliability for your organization.
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                color="white"
              >
                Secure Data Management
              </Typography>
              <Typography variant="body2" component="p" color="white">
                Take complete control of your data with our secure,
                blockchain-enabled platform that prioritizes privacy and
                transparency.
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                color="white"
              >
                Streamlined Processes
              </Typography>
              <Typography variant="body2" component="p" color="white">
                Reduce complexity and save time with our intuitive verification
                workflow designed for modern organizations.
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </HomeSection>

      {/* Team Section */}
      <HomeSection>
        <Stack spacing={4} alignItems="center" sx={{ width: "100%", px: 4 }}>
          <Typography
            variant="h3"
            component="h2"
            align="center"
            gutterBottom
            color="primary"
          >
            Meet the Team
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={4}
            flexWrap="wrap"
            justifyContent="center"
          >
            {[
              { name: "Tanner Greenwood", description: "RAD DESCRIPTION" },
              { name: "Jacob Sargent", description: "RAD DESCRIPTION" },
              { name: "Dexter Stephens", description: "RAD DESCRIPTION" },
              { name: "Drew Wilson", description: "RAD DESCRIPTION" },
            ].map((member) => (
              <Card
                key={member.name}
                sx={{ minWidth: { xs: "100%", sm: "45%", md: "22%" } }}
              >
                <CardContent>
                  <Stack spacing={1} alignItems="center">
                    <Typography variant="h5" component="h2" color="white">
                      {member.name}
                    </Typography>
                    <Typography component="p" color="white">
                      {member.description}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Stack>
      </HomeSection>
      <Divider
        variant="middle"
        sx={{ border: "1px solid rgba(28, 70, 112, 0.4)" }}
      />
      <Stack>
        <Typography
          variant="h6"
          component="h2"
          align="center"
          gutterBottom
          color="primary"
        >
          Contact Us to do liquidity provisioning or to purchase KASPA
        </Typography>
      </Stack>
    </div>
  );
}
