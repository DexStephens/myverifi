import {
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  Divider,
  Box,
} from "@mui/material";
import { Link as MUILink } from '@mui/material';
import { Link, useNavigate } from "react-router";
import HomeSection from "../components/HomeSection";
import "../styles/style.scss";
import { useUser } from "../context/UserContext";
import backgroundPic from "../../assets/myverifiHome.png"; // Import the image

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
      {/* Top Image */}

      {/* Call to Action Section */}
      <HomeSection sx={{ padding: 0, marginTop: "-30px" }}> {/* Adjusted margin to bring it up */}
        <Stack spacing={4} alignItems="center" textAlign="center">
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
      <HomeSection sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
  <Stack 
    spacing={6} 
    alignItems="center" 
    sx={{ 
      width: "100%", 
      px: { xs: 2, md: 4 }, 
      py: 6,
      flexGrow: 1, // Allows the stack to expand and push content away from footer
      overflow: 'auto' // Ensures content scrolls if it overflows
    }}
  >
    <Typography
      variant="h3"
      component="h2"
      align="center"
      gutterBottom
      color="primary"
      sx={{ mb: 4 }}
    >
      Meet the Team
    </Typography>

    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={{ xs: 2, sm: 2 }}
      flexWrap="wrap"
      justifyContent="center"
      alignItems="center"
      sx={{ 
        maxWidth: 1400, // Adjusted from 1200 to accommodate wider cards
        width: '100%',
        gap: 4, // Adds space between cards
      }}
    >
      {[
        { 
          name: "Tanner Greenwood", 
          role: "Frontend Developer & Kaspa Enthusiast",
          description: "RAD DESCRIPTION",
          avatar: "https://media.licdn.com/dms/image/v2/D4E03AQEOvsNhMdmlnw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1664595581598?e=1747872000&v=beta&t=qTjjNOP5l_SOaiXA21mrpCt_t1jsMFZoWF5oW3pfiLE",
          social: { github: "https://github.com/tannergwood", linkedin: "https://www.linkedin.com/in/tanner-greenwood/" }
        },
        {
          name: "Jacob Sargent", 
          role: "Project Manager & Kaspa Enthusiast",
          description: "RAD DESCRIPTION",
          avatar: "https://media.licdn.com/dms/image/v2/D5603AQFG5FMmFnTQgw/profile-displayphoto-shrink_200_200/B56ZTXeY73GUAc-/0/1738781855880?e=2147483647&v=beta&t=7q7ZBDj4e_MauLtx336cHnQ62jFUeCsRKkHEjIA7mG8",
          social: { github: "https://github.com/jrsarge", linkedin: "https://www.linkedin.com/in/jacobsargent/" }
        },
        { 
          name: "Drew Wilson", 
          role: "Full Stack Developer & Kaspa Enthusiast",
          description: "RAD DESCRIPTION",
          avatar: "https://media.licdn.com/dms/image/v2/D5603AQGACjRANKFh6w/profile-displayphoto-shrink_200_200/B56ZPv1xTYHoAY-/0/1734895670793?e=2147483647&v=beta&t=0wqNLir0UsSsQSAu7UsyS9qXf4RTHlou55yRqtul4u4",
          social: { github: "https://github.com/kahuku", linkedin: "https://www.linkedin.com/in/drewwilson2002/" }
        },
        { 
          name: "Dexter Stephens", 
          role: "Full Stack Blockchain Engineer & Kaspa Enthusiast",
          description: "RAD DESCRIPTION",
          avatar: "https://media.licdn.com/dms/image/v2/D4E03AQHWuzsbhezhRg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1712931829626?e=1747872000&v=beta&t=wasOoHDBJm8ShM3fyeWzy394b4JPjEItc1IEvvPdpzA",
          social: { github: "https://github.com/DexStephens", linkedin: "https://www.linkedin.com/in/dexterstephens/" }
        },
      ].map((member) => (
        <Card
          key={member.name}
          sx={{
            width: { xs: "100%", sm: "47%", md: "30%" },
            m: 1,
            backgroundColor: "#1a1a1a",
            borderRadius: 2,
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            transition: "transform 0.2s",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Stack spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  backgroundColor: "#333",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {member.avatar ? (
                  <img src={member.avatar} alt={member.name} style={{ width: "100%" }} />
                ) : (
                  <Typography color="grey.500">Photo</Typography>
                )}
              </Box>

              <Typography
                variant="h6"
                component="h3"
                color="white"
                sx={{ fontWeight: 600 }}
              >
                {member.name}
              </Typography>

              <Typography
                variant="subtitle2"
                color="primary"
                sx={{ opacity: 0.9, textAlign: "center" }}
              >
                {member.role}
              </Typography>

              <Typography
                variant="body2"
                color="grey.300"
                sx={{ textAlign: "center" }}
              >
                {member.description}
              </Typography>

              <Stack direction="row" spacing={2}>
                <MUILink
                  href={member.social.github || "#"}
                  color="inherit"
                  underline="hover"
                  sx={{ 
                    opacity: member.social.github ? 1 : 0.5,
                    color: 'grey.400'
                  }}
                >
                  GitHub
                </MUILink>
                <MUILink
                  href={member.social.linkedin || "#"}
                  color="inherit"
                  underline="hover"
                  sx={{ 
                    opacity: member.social.linkedin ? 1 : 0.5,
                    color: 'grey.400'
                  }}
                >
                  LinkedIn
                </MUILink>
              </Stack>
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