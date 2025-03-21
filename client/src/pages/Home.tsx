import {
  Typography,
  Stack,
  Divider,
} from "@mui/material";

import HomeSection from "../components/HomeSection";
import "../styles/style.scss";
import TeamComponent from "../components/Homepage/TeamComponent";
import CallToActionComponent from "../components/Homepage/CallToActionComponent";
import InfoComponent from "../components/Homepage/InfoComponent";

export default function Home() {

  return (
    <div className="home-wrapper">
      <HomeSection sx={{ padding: 0, marginTop: "-30px" }}>
        <CallToActionComponent />
      </HomeSection>

      <HomeSection>
        <InfoComponent />
      </HomeSection>

      {/* Team Section */}
      <HomeSection sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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
          Contact Us to do liquidity provisioning or to purchase KASPA
        </Typography>
      </Stack>
    </div>
  );
}