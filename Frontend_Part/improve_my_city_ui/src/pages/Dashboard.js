import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Paper,
} from "@mui/material";
import {
  Add as AddIcon,
  Warning as WarningIcon,
  Build as BuildIcon,
  CheckCircle as CheckCircleIcon,
  List as ListIcon,
  People as PeopleIcon,
  Analytics as AnalyticsIcon,
  Assignment as AssignmentIcon,
  History as HistoryIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { complaintService } from "../services/complaintService";
import AppButton from "../components/common/AppButton";
import useResponsive from "../hooks/useResponsive";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isMobile, isTablet } = useResponsive();

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    myAssigned: 0,
    myResolved: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const complaintsResponse = await complaintService.getComplaints();

      if (complaintsResponse.success) {
        const complaints = complaintsResponse.data;
        calculateStats(complaints);
      } else {
        setError("Failed to load dashboard data");
      }
    } catch (error) {
      console.error("Dashboard error:", error);
      setError(error.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (complaints) => {
    let statsData = {
      total: complaints.length,
      pending: complaints.filter((c) => c.status === "Pending").length,
      inProgress: complaints.filter((c) => c.status === "InProgress").length,
      resolved: complaints.filter((c) => c.status === "Resolved").length,
      myAssigned: 0,
      myResolved: 0,
    };

    if (user?.roles?.includes("Officer")) {
      const myComplaints = complaints.filter(
        (c) => c.assignedTo?.userId === user.userId
      );
      statsData.myAssigned = myComplaints.length;
      statsData.myResolved = myComplaints.filter(
        (c) => c.status === "Resolved"
      ).length;
    }

    if (user?.roles?.includes("User")) {
      const myComplaints = complaints.filter(
        (c) => c.createdBy?.userId === user.userId
      );
      statsData.total = myComplaints.length;
      statsData.pending = myComplaints.filter(
        (c) => c.status === "Pending"
      ).length;
      statsData.inProgress = myComplaints.filter(
        (c) => c.status === "InProgress"
      ).length;
      statsData.resolved = myComplaints.filter(
        (c) => c.status === "Resolved"
      ).length;
    }

    setStats(statsData);
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card
      sx={{
        height: "100%",
        transition: "all 0.3s ease",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 3,
        },
      }}
      onClick={() => navigate("/complaints")}
    >
      <CardContent sx={{ textAlign: "center", p: isMobile ? 2 : 3 }}>
        <Box sx={{ color, mb: 1, fontSize: isMobile ? "2rem" : "2.5rem" }}>
          {icon}
        </Box>
        <Typography
          variant={isMobile ? "h5" : "h4"}
          component="div"
          color={color}
          fontWeight="bold"
          gutterBottom
        >
          {value}
        </Typography>
        <Typography
          color="textSecondary"
          variant={isMobile ? "body2" : "h6"}
          sx={{ fontWeight: 500 }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="textSecondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Container>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  const gridSpacing = isMobile ? 1 : 2;
  const statCardSize = isMobile ? 6 : 4;

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 1 }}>
        Welcome back, {user?.fullName}!
      </Typography>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={
            <AppButton
              size="small"
              onClick={fetchDashboardData}
              variant="outlined"
            >
              Retry
            </AppButton>
          }
        >
          {error}
        </Alert>
      )}

      {/* Role-based greeting */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          bgcolor: "primary.main",
          color: "white",
          borderRadius: 3,
          background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
        }}
      >
        <Typography variant="h6" fontWeight="600">
          {user?.roles?.includes("Admin") &&
            "Administrator Dashboard - Manage all city complaints"}
          {user?.roles?.includes("Officer") &&
            "Officer Dashboard - View and manage assigned complaints"}
          {user?.roles?.includes("User") &&
            "Citizen Dashboard - Track your reported issues"}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
          {user?.roles?.includes("Admin") &&
            "You have full access to manage users, complaints, and system analytics."}
          {user?.roles?.includes("Officer") &&
            "You can view assigned complaints, update their status, and access analytics."}
          {user?.roles?.includes("User") &&
            "You can report new issues and track the progress of your complaints."}
        </Typography>
      </Paper>

      {/* Quick Stats */}
      <Grid container spacing={gridSpacing} sx={{ mb: 4 }}>
        <Grid item xs={statCardSize} sm={4} md={2}>
          <StatCard
            title="Total"
            value={stats.total}
            icon={<ListIcon />}
            color="#1976d2"
          />
        </Grid>

        <Grid item xs={statCardSize} sm={4} md={2}>
          <StatCard
            title="Pending"
            value={stats.pending}
            icon={<WarningIcon />}
            color="#ed6c02"
          />
        </Grid>

        <Grid item xs={statCardSize} sm={4} md={2}>
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon={<BuildIcon />}
            color="#0288d1"
          />
        </Grid>

        <Grid item xs={statCardSize} sm={4} md={2}>
          <StatCard
            title="Resolved"
            value={stats.resolved}
            icon={<CheckCircleIcon />}
            color="#2e7d32"
          />
        </Grid>

        {/* Officer Specific Stats */}
        {user?.roles?.includes("Officer") && (
          <>
            <Grid item xs={statCardSize} sm={4} md={2}>
              <StatCard
                title="My Assigned"
                value={stats.myAssigned}
                icon={<AssignmentIcon />}
                color="#9c27b0"
              />
            </Grid>
            <Grid item xs={statCardSize} sm={4} md={2}>
              <StatCard
                title="My Resolved"
                value={stats.myResolved}
                icon={<CheckCircleIcon />}
                color="#2e7d32"
              />
            </Grid>
          </>
        )}
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={isMobile ? 2 : 3} sx={{ mb: 4 }}>
        {/* Report Issue - For ALL ROLES including Officer */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ textAlign: "center", p: 3, height: "100%" }}>
            <CardContent>
              <AddIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
              <Typography variant="h6" gutterBottom fontWeight="600">
                Report New Issue
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                Found a problem in your area? Report it quickly and help improve
                your city.
              </Typography>
              <AppButton
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate("/complaints/new")}
                fullWidth
                size={isMobile ? "medium" : "large"}
              >
                {isMobile ? "Report Issue" : "Report New Issue"}
              </AppButton>
            </CardContent>
          </Card>
        </Grid>

        {/* View Complaints */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ textAlign: "center", p: 3, height: "100%" }}>
            <CardContent>
              <ListIcon sx={{ fontSize: 48, color: "secondary.main", mb: 2 }} />
              <Typography variant="h6" gutterBottom fontWeight="600">
                View Complaints
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                Track the status of all reported issues and stay updated on
                progress.
              </Typography>
              <AppButton
                variant="contained"
                color="secondary"
                startIcon={<ListIcon />}
                onClick={() => navigate("/complaints")}
                fullWidth
                size={isMobile ? "medium" : "large"}
              >
                {isMobile ? "View All" : "View All Complaints"}
              </AppButton>
            </CardContent>
          </Card>
        </Grid>

        {/* Analytics */}
        {(user?.roles?.includes("Admin") ||
          user?.roles?.includes("Officer")) && (
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ textAlign: "center", p: 3, height: "100%" }}>
              <CardContent>
                <AnalyticsIcon
                  sx={{ fontSize: 48, color: "info.main", mb: 2 }}
                />
                <Typography variant="h6" gutterBottom fontWeight="600">
                  View Analytics
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mb: 3 }}
                >
                  Get insights and statistics about complaints and system usage.
                </Typography>
                <AppButton
                  variant="contained"
                  color="info"
                  startIcon={<AnalyticsIcon />}
                  onClick={() => navigate("/analytics")}
                  fullWidth
                  size={isMobile ? "medium" : "large"}
                >
                  {isMobile ? "Analytics" : "View Analytics"}
                </AppButton>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Admin Tools */}
      {user?.roles?.includes("Admin") && (
        <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
          <Typography variant="h5" gutterBottom fontWeight="600" sx={{ mb: 2 }}>
            Admin Tools
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <AppButton
              variant="outlined"
              size="large"
              onClick={() => navigate("/users")}
              startIcon={<PeopleIcon />}
            >
              User Management
            </AppButton>
            <AppButton
              variant="outlined"
              size="large"
              onClick={() => navigate("/analytics")}
              startIcon={<AnalyticsIcon />}
            >
              Analytics Dashboard
            </AppButton>
            <AppButton
              variant="outlined"
              size="large"
              onClick={() => navigate("/audit")}
              startIcon={<HistoryIcon />}
            >
              Audit Logs
            </AppButton>
          </Box>
        </Paper>
      )}

      {/* Officer Tools */}
      {user?.roles?.includes("Officer") && (
        <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
          <Typography variant="h5" gutterBottom fontWeight="600" sx={{ mb: 2 }}>
            Officer Tools
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <AppButton
              variant="outlined"
              size="large"
              onClick={() => navigate("/complaints")}
              startIcon={<AssignmentIcon />}
            >
              Manage Complaints
            </AppButton>
            <AppButton
              variant="outlined"
              size="large"
              onClick={() => navigate("/analytics")}
              startIcon={<AnalyticsIcon />}
            >
              View Analytics
            </AppButton>
          </Box>
        </Paper>
      )}

      {/* Refresh Button */}
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <AppButton
          variant="text"
          onClick={fetchDashboardData}
          loading={loading}
        >
          Refresh Data
        </AppButton>
      </Box>
    </Container>
  );
};

export default Dashboard;
