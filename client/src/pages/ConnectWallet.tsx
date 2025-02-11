import {
  Container,
  Typography,
  Button,
  Box,
  Divider,
  Grid,
} from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { WagmiConnectWallet } from "../components/WagmiConnectWallet";
import { config } from "../components/WagmiConfig";

const queryClient = new QueryClient();

export default function ConnectWallet() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Container maxWidth="md">
          <Box
            sx={{
              textAlign: "center",
              mt: 8,
            }}
          >
            <Typography variant="h3" gutterBottom>
              Create/Connect your Metamask Wallet
            </Typography>
            <Typography variant="body1" color="white" gutterBottom>
              You need a Metamask wallet to issue verifiable credentials
            </Typography>

            <Box
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                mt: 4,
                p: 4,
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={5}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      height: "100%",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      Don't have a wallet?
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      href="https://metamask.io/"
                      target="_blank"
                    >
                      Create One Here
                    </Button>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={2}>
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                      margin: "auto",
                      height: "100%",
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={5}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      height: "100%",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      Already have a wallet?
                    </Typography>
                    <WagmiConnectWallet />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
