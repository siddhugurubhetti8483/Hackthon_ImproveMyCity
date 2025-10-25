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
  Menu as MenuIcon,
  Analytics as AnalyticsIcon,
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

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Improve My City
        </Typography>

        {/* Theme Toggle */}
        <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
          <Brightness7 />
          <Switch checked={isDarkMode} onChange={toggleTheme} color="default" />
          <Brightness4 />
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
              {/* Officer ke liye Analytics option */}
              {user?.roles?.includes("Officer") && (
                <MenuItem onClick={handleAnalytics}>
                  <ListItemIcon>
                    <AnalyticsIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Analytics" />
                </MenuItem>
              )}

              <MenuItem onClick={handleProfile}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
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
