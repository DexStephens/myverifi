import { Stack, Typography, Card, CardContent, Box } from "@mui/material";
import { Link as MUILink } from "@mui/material";

export default function TeamComponent() {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      sx={{
        width: "100%",
        px: { xs: 2, md: 4 },
        py: 2,
        flexGrow: 1, // Allows the stack to expand and push content away from footer
        overflow: "auto", // Ensures content scrolls if it overflows
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
          maxWidth: 1600, // Adjusted from 1200 to accommodate wider cards
          width: "100%",
          gap: 4, // Adds space between cards
        }}
      >
        {[
          {
            name: "Tanner Greenwood",
            role: "Frontend Developer",
            avatar:
              "https://media.licdn.com/dms/image/v2/D4E03AQEOvsNhMdmlnw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1664595581598?e=1747872000&v=beta&t=qTjjNOP5l_SOaiXA21mrpCt_t1jsMFZoWF5oW3pfiLE",
            social: {
              github: "https://github.com/tannergwood",
              linkedin: "https://www.linkedin.com/in/tanner-greenwood/",
            },
          },
          {
            name: "Jacob Sargent",
            role: "Project Manager",
            avatar:
              "https://media.licdn.com/dms/image/v2/D5603AQFG5FMmFnTQgw/profile-displayphoto-shrink_200_200/B56ZTXeY73GUAc-/0/1738781855880?e=2147483647&v=beta&t=7q7ZBDj4e_MauLtx336cHnQ62jFUeCsRKkHEjIA7mG8",
            social: {
              github: "https://github.com/jrsarge",
              linkedin: "https://www.linkedin.com/in/jacobsargent/",
            },
          },
          {
            name: "Drew Wilson",
            role: "Full Stack Developer",
            avatar:
              "https://media.licdn.com/dms/image/v2/D5603AQGACjRANKFh6w/profile-displayphoto-shrink_200_200/B56ZPv1xTYHoAY-/0/1734895670793?e=2147483647&v=beta&t=0wqNLir0UsSsQSAu7UsyS9qXf4RTHlou55yRqtul4u4",
            social: {
              github: "https://github.com/kahuku",
              linkedin: "https://www.linkedin.com/in/drewwilson2002/",
            },
          },
          {
            name: "Dexter Stephens",
            role: "Blockchain Engineer",
            avatar:
              "https://media.licdn.com/dms/image/v2/D4E03AQHWuzsbhezhRg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1712931829626?e=1747872000&v=beta&t=wasOoHDBJm8ShM3fyeWzy394b4JPjEItc1IEvvPdpzA",
            social: {
              github: "https://github.com/DexStephens",
              linkedin: "https://www.linkedin.com/in/dexterstephens/",
            },
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
                    <img
                      src={member.avatar}
                      alt={member.name}
                      style={{ width: "100%" }}
                    />
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
                  variant="body1"
                  color="secondary"
                  fontWeight={800}
                  fontSize={"1.2rem"}
                  sx={{ opacity: 0.95, textAlign: "center" }}
                >
                  {member.role}
                </Typography>

                {/* <Typography
                variant="body2"
                color="grey.300"
                sx={{ textAlign: "center" }}
              >
                {member.description}
              </Typography> */}

                <Stack direction="row" spacing={2}>
                  <MUILink
                    href={member.social.github || "#"}
                    color="inherit"
                    underline="hover"
                    sx={{
                      opacity: member.social.github ? 1 : 0.5,
                      color: "grey.400",
                      "&:hover": {
                        color: "success.main",
                      },
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
                      color: "grey.400",
                      "&:hover": {
                        color: "success.main",
                      },
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
  );
}
