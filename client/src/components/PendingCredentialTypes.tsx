import {
  IconButton,
  Badge,
  Popover,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { useState } from "react";

interface PendingCredentialType {
  title: string;
  status: "pending" | "processing" | "completed" | "failed";
  addedAt: Date;
  error?: string;
}

interface PendingCredentialTypesProps {
  pendingCredentials: PendingCredentialType[];
}

export const PendingCredentialTypes = ({
  pendingCredentials,
}: PendingCredentialTypesProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleHourglassClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  if (pendingCredentials.length === 0) return null;

  return (
    <>
      <IconButton
        onClick={handleHourglassClick}
        sx={{
          color: "warning.main",
          "&:hover": { color: "warning.dark" },
        }}
      >
        <Badge badgeContent={pendingCredentials.length} color="warning">
          <HourglassEmptyIcon />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box sx={{ p: 2, maxWidth: 300 }}>
          <Typography variant="h6" sx={{ mb: 1, color: "white" }}>
            Pending Credentials
          </Typography>
          <List dense>
            {pendingCredentials.map((cred, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={cred.title}
                  secondary={`Status: ${cred.status}`}
                  primaryTypographyProps={{
                    sx: { color: "white" },
                  }}
                  secondaryTypographyProps={{
                    sx: { color: "warning.main" },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Popover>
    </>
  );
};
