import { Stack, Card, CardContent, Typography } from "@mui/material";

export default function InfoComponent() {
    return (
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
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
    );
}