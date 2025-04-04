import { Typography, Stack, Divider } from "@mui/material";
import HomeSection from "../components/HomeSection";
import "../styles/style.scss";
import TeamComponent from "../components/Homepage/TeamComponent";
import CallToActionComponent from "../components/Homepage/CallToActionComponent";
import InfoComponent from "../components/Homepage/InfoComponent";
import AboutUsComponent from "../components/Homepage/AboutUsComponent";

export default function Home() {
  return (
    <div className="home-wrapper">
      <HomeSection sx={{ my: 2 }}>
        <CallToActionComponent />
      </HomeSection>

      <HomeSection sx={{ my: 2 }}>
        <InfoComponent />
      </HomeSection>

      <HomeSection id="about" sx={{ my: 2 }}>
        <AboutUsComponent />
      </HomeSection>

      <HomeSection sx={{ my: 2 }}>
        <TeamComponent />
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
          Contact Us to Learn More
        </Typography>
      </Stack>
    </div>
  );
}
