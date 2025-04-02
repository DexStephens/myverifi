import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router";

export const AboutUsComponent: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        textAlign: "center",
        padding: "4rem 8rem",
        backgroundColor: "#f5f5f5",
        borderRadius: "12px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography
        variant="h3"
        component="h1"
        sx={{ fontWeight: "bold", mb: 4 }}
      >
        About Myverifi
      </Typography>

      <Typography variant="body1" sx={{ mb: 3, fontSize: "1.2rem" }}>
        Resume fraud is a growing problem -- and it's becoming an increasingly
        costly one. High profile cases like that of George Santos, who was
        expelled from Congress after it was revealed he lied about his education
        and work history, highlight the need for a more reliable way to verify
        job candidates' qualifications.
      </Typography>

      <Typography variant="body1" sx={{ mb: 3, fontSize: "1.2rem" }}>
        Hiring employees who fake their qualifications can result in disastrous
        consequences for companies. Take, for example, Ken Lonchar, former CFO
        of the company now known as Symantec. After it was discovered that
        Lonchar had falsified an MBA degree, his company lost 17% of its stock
        value and was forced to pay $30 million in penalties due to a lawsuit
        from the SEC.
      </Typography>

      <Typography variant="body1" sx={{ mb: 3, fontSize: "1.2rem" }}>
        Myverifi is a blockchain-based credential verification system designed
        to prevent these costly mistakes. By using our platform, employers can
        quickly and securely verify job candidates' educational degrees and
        certifications, ensuring they hire only qualified individuals. With
        credential issuers such as universities on board, applicants can display
        verified credentials on their profile, allowing employers to easily
        check their authenticity through our platform.
      </Typography>

      <Typography variant="body1" sx={{ mb: 3, fontSize: "1.2rem" }}>
        Our system is efficient and secure, making resume fraud a thing of the
        past. Employers can verify applicants' qualifications instantly,
        reducing the risk of fraudulent hires. Additionally, our API allows for
        seamless integration with existing Learning Management Systems (LMS) and
        Human Resource Management Software (HRMS), making credential issuance
        and validation easier than ever.
      </Typography>

      <Button
        variant="contained"
        color="secondary"
        sx={{
          mt: 4,
          padding: "0.8rem 2rem",
          fontSize: "1.1rem",
          fontWeight: "bold",
          "&:hover": {
            backgroundColor: "success.main",
          },
        }}
        onClick={() => navigate(user ? "/dashboard" : "/login")}
      >
        Get Started
      </Button>
    </Box>
  );
};

export default AboutUsComponent;
