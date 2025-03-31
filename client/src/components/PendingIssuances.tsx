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
import { PendingIssuanceType } from "../utils/user.util";

interface PendingIssuancesProps {
  pendingIssuances: PendingIssuanceType[];
}

export const PendingIssuances = ({
  pendingIssuances,
}: PendingIssuancesProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleHourglassClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  if (pendingIssuances.length === 0) return null;

  return (
    <>
      <IconButton
        onClick={handleHourglassClick}
        sx={{
          color: "warning.main",
          "&:hover": { color: "warning.dark" },
        }}
      >
        <Badge badgeContent={pendingIssuances.length} color="warning">
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
            Pending Issuances
          </Typography>
          <List dense>
            {pendingIssuances.map((issuance, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={
                    issuance.holder_emails.length > 1
                      ? `Batch Issue of ${issuance.credential_name}`
                      : `${issuance.credential_name} to ${issuance.holder_emails[0]}`
                  }
                  secondary={`Status: ${issuance.status}`}
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
