import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Security as SecurityIcon,
  Edit as EditIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";

const Profile = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Here you would typically call an API to update the profile
      // For now, we'll just simulate success
      setTimeout(() => {
        setSuccess("Profile updated successfully!");
        setEditing(false);
        setLoading(false);
      }, 1000);
    } catch (error) {
      setError(error.message || "Failed to update profile");
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    // Implement password change functionality
    setSuccess("Password change functionality coming soon!");
  };

  if (!user) {
    return (
      <Container>
        <Alert severity="error">User not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        My Profile
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Information */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Typography variant="h5">Personal Information</Typography>
              <Button
                startIcon={editing ? <SaveIcon /> : <EditIcon />}
                onClick={editing ? handleSave : () => setEditing(true)}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={20} />
                ) : editing ? (
                  "Save"
                ) : (
                  "Edit"
                )}
              </Button>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={profileData.fullName}
                  onChange={(e) =>
                    setProfileData({ ...profileData, fullName: e.target.value })
                  }
                  disabled={!editing || loading}
                  InputProps={{
                    startAdornment: (
                      <PersonIcon sx={{ mr: 1, color: "text.secondary" }} />
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  value={profileData.email}
                  disabled // Email shouldn't be editable usually
                  InputProps={{
                    startAdornment: (
                      <EmailIcon sx={{ mr: 1, color: "text.secondary" }} />
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Member Since"
                  value={new Date(user.createdAt).toLocaleDateString()}
                  disabled
                  InputProps={{
                    startAdornment: (
                      <CalendarIcon sx={{ mr: 1, color: "text.secondary" }} />
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Security Settings */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h5" gutterBottom>
              Security Settings
            </Typography>

            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={user.isMFAEnabled || false}
                    onChange={() => setSuccess("MFA settings coming soon!")}
                  />
                }
                label="Two-Factor Authentication"
              />
              <Typography variant="body2" color="textSecondary">
                Enhance your account security with two-factor authentication
              </Typography>
            </Box>

            <Button
              variant="outlined"
              onClick={handleChangePassword}
              startIcon={<SecurityIcon />}
            >
              Change Password
            </Button>
          </Paper>
        </Grid>

        {/* Sidebar - User Summary */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  color: "white",
                  fontSize: "2rem",
                }}
              >
                {user.fullName?.charAt(0)?.toUpperCase() || "U"}
              </Box>

              <Typography variant="h6" gutterBottom>
                {user.fullName}
              </Typography>

              <Typography variant="body2" color="textSecondary" gutterBottom>
                {user.email}
              </Typography>

              <Box sx={{ my: 2 }}>
                {user.roles?.map((role, index) => (
                  <Chip
                    key={index}
                    label={role}
                    color={
                      role === "Admin"
                        ? "error"
                        : role === "Officer"
                        ? "warning"
                        : "primary"
                    }
                    size="small"
                    sx={{ mr: 0.5, mb: 0.5 }}
                  />
                ))}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ textAlign: "left" }}>
                <Typography variant="body2" gutterBottom>
                  <strong>User ID:</strong> {user.userId}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Status:</strong>
                  <Chip
                    label={user.isActive ? "Active" : "Inactive"}
                    color={user.isActive ? "success" : "default"}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Typography>
                <Typography variant="body2">
                  <strong>Last Login:</strong>{" "}
                  {user.lastLoginDate
                    ? new Date(user.lastLoginDate).toLocaleString()
                    : "Never"}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
