import { Typography, Button, Grid2, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router";
import HomeSection from "../components/HomeSection";
import HomeHeader from "../components/HomeHeader";
import "./Home.scss";

export default function Home() {
  const navigate = useNavigate();

  const handleGetVerified = () => {
    navigate("/register");
  };

  return (
    <div className="home-wrapper">
      <HomeHeader />

      {/* Call to Action Section */}
      <HomeSection>
        <Grid2
          container
          justifyContent="center"
          alignItems="center"
          spacing={4}
        >
          <Typography variant="h2" component="h1" gutterBottom>
            myverifi
          </Typography>
          <Typography variant="h5" component="p" gutterBottom>
            Instant verification. Secure transactions. Controlled data.
          </Typography>
          <Button
            //component={Link}
            //to="/register"
            variant="contained"
            color="primary"
            size="large"
            onClick={handleGetVerified}
          >
            Get Verified
          </Button>
        </Grid2>
      </HomeSection>

      {/* Card Section for More Info */}
      <HomeSection>
        <Grid2 container spacing={4} justifyContent="center">
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Comprehensive Verification
              </Typography>
              <Typography variant="body2" component="p">
                Our advanced verification process ensures the highest level of
                accuracy and reliability for your organization.
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Secure Data Management
              </Typography>
              <Typography variant="body2" component="p">
                Take complete control of your data with our secure,
                blockchain-enabled platform that prioritizes privacy and
                transparency.
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Streamlined Processes
              </Typography>
              <Typography variant="body2" component="p">
                Reduce complexity and save time with our intuitive verification
                workflow designed for modern organizations.
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
      </HomeSection>

      {/* Team Section */}
      <HomeSection>
        <Typography variant="h3" component="h2" align="center" gutterBottom>
          Meet the Team
        </Typography>
        <Grid2 container spacing={4} justifyContent="center">
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" align="center">
                Tanner Greenwood
              </Typography>
              <Typography variant="body2" component="p" align="center">
                RAD DESCRIPTION
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" align="center">
                Jacob Sargent
              </Typography>
              <Typography variant="body2" component="p" align="center">
                RAD DESCRIPTION
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" align="center">
                Dexter Stephens
              </Typography>
              <Typography variant="body2" component="p" align="center">
                RAD DESCRIPTION
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" align="center">
                Drew Wilson
              </Typography>
              <Typography variant="body2" component="p" align="center">
                RAD DESCRIPTION
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
      </HomeSection>
    </div>
  );
}
