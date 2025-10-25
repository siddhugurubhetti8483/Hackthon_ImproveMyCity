import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Switch,
  Box,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  AccountCircle,
  Brightness4,
  Brightness7,
  Analytics as AnalyticsIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  const handleProfile = () => {
    navigate("/profile");
    handleClose();
  };

  const handleAnalytics = () => {
    navigate("/analytics");
    handleClose();
  };

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            cursor: "pointer",
            fontWeight: "bold",
          }}
          onClick={handleDashboard}
        >
          Improve My City
        </Typography>

        {/* Theme Toggle */}
        <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
          <Brightness7 sx={{ fontSize: 20 }} />
          <Switch
            checked={isDarkMode}
            onChange={toggleTheme}
            color="default"
            size="small"
          />
          <Brightness4 sx={{ fontSize: 20 }} />
        </Box>

        {user ? (
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {/* Profile */}
              <MenuItem onClick={handleProfile}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </MenuItem>

              {/* Analytics for Officer and Admin */}
              {(user?.roles?.includes("Officer") ||
                user?.roles?.includes("Admin")) && (
                <MenuItem onClick={handleAnalytics}>
                  <ListItemIcon>
                    <AnalyticsIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Analytics" />
                </MenuItem>
              )}

              {/* Logout */}
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </MenuItem>
            </Menu>
          </div>
        ) : (
          <Box>
            <Button color="inherit" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button color="inherit" onClick={() => navigate("/register")}>
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
