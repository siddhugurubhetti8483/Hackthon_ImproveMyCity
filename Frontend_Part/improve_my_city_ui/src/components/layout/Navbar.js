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
  useMediaQuery,
  useTheme,
  Badge,
} from "@mui/material";
import {
  AccountCircle,
  Brightness4,
  Brightness7,
  Analytics as AnalyticsIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  ArrowBack as ArrowBackIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Dashboard as DashboardIcon,
  Report as ReportIcon,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { useTheme as useCustomTheme } from "../../context/ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useCustomTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

  // Show back button except on these pages
  const showBackButton = !["/", "/dashboard", "/login", "/register"].includes(
    location.pathname
  );

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenu = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchor(null);
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

  const handleComplaints = () => {
    navigate("/complaints");
    handleClose();
  };

  const handleNotifications = () => {
    // Implement notifications
    console.log("Notifications clicked");
  };

  return (
    <AppBar position="static" elevation={2} sx={{ bgcolor: "primary.main" }}>
      <Toolbar>
        {/* Back Button */}
        {showBackButton && (
          <IconButton
            color="inherit"
            onClick={() => navigate(-1)}
            sx={{ mr: 1 }}
            aria-label="Go back"
            size="large"
          >
            <ArrowBackIcon />
          </IconButton>
        )}

        {/* Logo/Brand */}
        <Typography
          variant={isMobile ? "h6" : "h5"}
          component="div"
          sx={{
            flexGrow: 1,
            cursor: "pointer",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            userSelect: "none",
          }}
          onClick={handleDashboard}
        >
          Improve My City
        </Typography>

        {/* Theme Toggle - Desktop */}
        {!isMobile && (
          <Box sx={{ display: "flex", alignItems: "center", mr: 2, gap: 1 }}>
            <Brightness7 sx={{ fontSize: 20 }} />
            <Switch
              checked={isDarkMode}
              onChange={toggleTheme}
              color="default"
              size="small"
            />
            <Brightness4 sx={{ fontSize: 20 }} />
          </Box>
        )}

        {user ? (
          <>
            {/* Desktop Menu */}
            {!isMobile && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Button
                  color="inherit"
                  onClick={handleDashboard}
                  startIcon={<DashboardIcon />}
                >
                  Dashboard
                </Button>
                <Button
                  color="inherit"
                  onClick={handleComplaints}
                  startIcon={<ReportIcon />}
                >
                  Complaints
                </Button>
                {(user?.roles?.includes("Officer") ||
                  user?.roles?.includes("Admin")) && (
                  <Button
                    color="inherit"
                    onClick={handleAnalytics}
                    startIcon={<AnalyticsIcon />}
                  >
                    Analytics
                  </Button>
                )}

                {/* Notifications */}
                <IconButton color="inherit" onClick={handleNotifications}>
                  <Badge badgeContent={0} color="secondary">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>

                {/* User Menu */}
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
              </Box>
            )}

            {/* Mobile Menu */}
            {isMobile && (
              <>
                <IconButton
                  color="inherit"
                  onClick={handleMobileMenu}
                  aria-label="open menu"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={mobileMenuAnchor}
                  open={Boolean(mobileMenuAnchor)}
                  onClose={handleClose}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      minWidth: 200,
                    },
                  }}
                >
                  <MenuItem onClick={handleDashboard}>
                    <ListItemIcon>
                      <DashboardIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                  </MenuItem>
                  <MenuItem onClick={handleComplaints}>
                    <ListItemIcon>
                      <ReportIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Complaints" />
                  </MenuItem>
                  {(user?.roles?.includes("Officer") ||
                    user?.roles?.includes("Admin")) && (
                    <MenuItem onClick={handleAnalytics}>
                      <ListItemIcon>
                        <AnalyticsIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Analytics" />
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleProfile}>
                    <ListItemIcon>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                  </MenuItem>
                  <MenuItem onClick={handleNotifications}>
                    <ListItemIcon>
                      <Badge badgeContent={0} color="secondary">
                        <NotificationsIcon fontSize="small" />
                      </Badge>
                    </ListItemIcon>
                    <ListItemText primary="Notifications" />
                  </MenuItem>
                  <MenuItem>
                    <ListItemIcon>
                      {isDarkMode ? <Brightness4 /> : <Brightness7 />}
                    </ListItemIcon>
                    <Switch
                      checked={isDarkMode}
                      onChange={toggleTheme}
                      size="small"
                    />
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                  </MenuItem>
                </Menu>
              </>
            )}

            {/* Desktop User Menu */}
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  minWidth: 180,
                },
              }}
            >
              <MenuItem onClick={handleProfile}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="My Profile" />
              </MenuItem>

              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              color="inherit"
              onClick={() => navigate("/login")}
              size={isMobile ? "small" : "medium"}
              sx={{ fontWeight: 600 }}
            >
              Login
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate("/register")}
              variant="outlined"
              size={isMobile ? "small" : "medium"}
              sx={{
                borderColor: "white",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderColor: "white",
                },
                fontWeight: 600,
              }}
            >
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
