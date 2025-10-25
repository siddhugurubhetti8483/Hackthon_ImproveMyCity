// import React, { useState, useEffect } from "react";
// import {
//   Container,
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   Box,
//   Alert,
//   CircularProgress,
//   Paper,
// } from "@mui/material";
// import {
//   Add as AddIcon,
//   Warning as WarningIcon,
//   Build as BuildIcon,
//   CheckCircle as CheckCircleIcon,
//   List as ListIcon,
//   People as PeopleIcon,
//   Analytics as AnalyticsIcon,
//   Assignment as AssignmentIcon,
// } from "@mui/icons-material";
// import { useAuth } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import { complaintService } from "../services/complaintService";
// // import { analyticsService } from "../services/analyticsService";

// const Dashboard = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const [stats, setStats] = useState({
//     total: 0,
//     pending: 0,
//     inProgress: 0,
//     resolved: 0,
//     myAssigned: 0,
//     myResolved: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetchComplaintStats();
//   }, [user]);

//   // ✅ Fetch complaints and compute stats (with Officer-specific logic)
//   const fetchComplaintStats = async () => {
//     try {
//       setLoading(true);
//       const response = await complaintService.getComplaints();

//       if (response.success) {
//         const complaints = response.data;

//         // Default stats (Admin/User)
//         let statsData = {
//           total: complaints.length,
//           pending: complaints.filter((c) => c.status === "Pending").length,
//           inProgress: complaints.filter((c) => c.status === "InProgress")
//             .length,
//           resolved: complaints.filter((c) => c.status === "Resolved").length,
//         };

//         // 👮 Officer ke liye filtered stats
//         if (user?.roles?.includes("Officer")) {
//           const myAssigned = complaints.filter(
//             (c) => c.assignedTo?.userId === user.userId
//           );

//           statsData = {
//             total: myAssigned.length,
//             pending: myAssigned.filter((c) => c.status === "Pending").length,
//             inProgress: myAssigned.filter((c) => c.status === "InProgress")
//               .length,
//             resolved: myAssigned.filter((c) => c.status === "Resolved").length,
//           };
//         }

//         setStats(statsData);
//       } else {
//         setError("Failed to fetch complaints");
//       }
//     } catch (error) {
//       setError(error.message || "Failed to load dashboard data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Reusable Card Component
//   const StatCard = ({ title, value, icon, color }) => (
//     <Card sx={{ height: "100%" }}>
//       <CardContent>
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//           }}
//         >
//           <Box>
//             <Typography color="textSecondary" gutterBottom variant="overline">
//               {title}
//             </Typography>
//             <Typography variant="h4" component="div" color={color}>
//               {value}
//             </Typography>
//           </Box>
//           <Box sx={{ color: color }}>{icon}</Box>
//         </Box>
//       </CardContent>
//     </Card>
//   );

//   // ✅ Loading State
//   if (loading) {
//     return (
//       <Container>
//         <Box
//           display="flex"
//           justifyContent="center"
//           alignItems="center"
//           minHeight="60vh"
//         >
//           <CircularProgress />
//         </Box>
//       </Container>
//     );
//   }

//   // ✅ Main Dashboard Render
//   return (
//     <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
//       <Typography variant="h4" gutterBottom>
//         Welcome back, {user?.fullName}!
//       </Typography>
//       {error && (
//         <Alert severity="error" sx={{ mb: 3 }}>
//           {error}
//         </Alert>
//       )}
//       {/* Role-based Header */}
//       <Paper sx={{ p: 3, mb: 4, bgcolor: "primary.main", color: "white" }}>
//         <Typography variant="h6">
//           {user?.roles?.includes("Admin") &&
//             "Administrator Dashboard - Manage all city complaints"}
//           {user?.roles?.includes("Officer") &&
//             "Officer Dashboard - View and manage your assigned complaints"}
//           {user?.roles?.includes("User") &&
//             "Citizen Dashboard - Track your reported issues"}
//         </Typography>
//       </Paper>
//       {/* ✅ Quick Stats Section */}
//       <Grid container spacing={3} sx={{ mb: 4 }}>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard
//             title="Total Complaints"
//             value={stats.total}
//             icon={<ListIcon sx={{ fontSize: 40 }} />}
//             color="primary.main"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard
//             title="Pending"
//             value={stats.pending}
//             icon={<WarningIcon sx={{ fontSize: 40 }} />}
//             color="warning.main"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard
//             title="In Progress"
//             value={stats.inProgress}
//             icon={<BuildIcon sx={{ fontSize: 40 }} />}
//             color="info.main"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard
//             title="Resolved"
//             value={stats.resolved}
//             icon={<CheckCircleIcon sx={{ fontSize: 40 }} />}
//             color="success.main"
//           />
//         </Grid>
//       </Grid>
//       {/* ✅ Quick Actions Section */}
//       <Grid container spacing={3}>
//         <Grid item xs={12} md={6}>
//           <Card sx={{ p: 3, textAlign: "center" }}>
//             <CardContent>
//               <AddIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
//               <Typography variant="h6" gutterBottom>
//                 Report New Issue
//               </Typography>
//               <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
//                 Found a problem in your area? Report it quickly and help improve
//                 your city.
//               </Typography>
//               <Button
//                 variant="contained"
//                 size="large"
//                 startIcon={<AddIcon />}
//                 onClick={() => navigate("/complaints/new")}
//               >
//                 Report Issue
//               </Button>
//             </CardContent>
//           </Card>
//         </Grid>

//         <Grid item xs={12} md={6}>
//           <Card sx={{ p: 3, textAlign: "center" }}>
//             <CardContent>
//               <ListIcon sx={{ fontSize: 48, color: "secondary.main", mb: 2 }} />
//               <Typography variant="h6" gutterBottom>
//                 View All Complaints
//               </Typography>
//               <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
//                 Track the status of all reported issues and stay updated on
//                 progress.
//               </Typography>
//               <Button
//                 variant="outlined"
//                 size="large"
//                 startIcon={<ListIcon />}
//                 onClick={() => navigate("/complaints")}
//               >
//                 View Complaints
//               </Button>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>
//       {/* ✅ Admin Tools Section */}
//       {user?.roles?.includes("Admin") && (
//         <Box sx={{ mt: 4 }}>
//           <Typography variant="h5" gutterBottom>
//             Admin Tools
//           </Typography>
//           <Grid container spacing={2}>
//             <Grid item>
//               <Button variant="outlined" onClick={() => navigate("/users")}>
//                 User Management
//               </Button>
//             </Grid>
//             <Grid item>
//               <Button variant="outlined" onClick={() => navigate("/analytics")}>
//                 Analytics
//               </Button>
//             </Grid>
//             <Grid item>
//               <Button variant="outlined" onClick={() => navigate("/audit")}>
//                 Audit Logs
//               </Button>
//             </Grid>
//           </Grid>
//         </Box>
//       )}
//       {/* // Dashboard component ke last mein yeh add karo: */}
//       {/* Officer-specific additional sections */}
//       {user?.roles?.includes("Officer") && (
//         <Box sx={{ mt: 4 }}>
//           <Typography variant="h5" gutterBottom>
//             Officer Tools
//           </Typography>
//           <Grid container spacing={2}>
//             <Grid item>
//               <Button
//                 variant="outlined"
//                 onClick={() => navigate("/complaints")}
//               >
//                 Manage Complaints
//               </Button>
//             </Grid>
//             <Grid item>
//               <Button variant="outlined" onClick={() => navigate("/analytics")}>
//                 View Analytics
//               </Button>
//             </Grid>
//           </Grid>
//         </Box>
//       )}
//     </Container>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
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

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ textAlign: "center" }}>
        <Box sx={{ color, mb: 1, fontSize: "2.5rem" }}>{icon}</Box>
        <Typography
          variant="h4"
          component="div"
          color={color}
          fontWeight="bold"
        >
          {value}
        </Typography>
        <Typography color="textSecondary" gutterBottom variant="h6">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="textSecondary">
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
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Welcome, {user?.fullName}!
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Role-based greeting */}
      <Paper sx={{ p: 2, mb: 3, bgcolor: "primary.main", color: "white" }}>
        <Typography variant="h6">
          {user?.roles?.includes("Admin") && "Administrator Dashboard"}
          {user?.roles?.includes("Officer") && "Officer Dashboard"}
          {user?.roles?.includes("User") && "Citizen Dashboard"}
        </Typography>
      </Paper>

      {/* Quick Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={4} md={2}>
          <StatCard
            title="Total"
            value={stats.total}
            icon={<ListIcon />}
            color="#1976d2"
          />
        </Grid>

        <Grid item xs={6} sm={4} md={2}>
          <StatCard
            title="Pending"
            value={stats.pending}
            icon={<WarningIcon />}
            color="#ed6c02"
          />
        </Grid>

        <Grid item xs={6} sm={4} md={2}>
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon={<BuildIcon />}
            color="#0288d1"
          />
        </Grid>

        <Grid item xs={6} sm={4} md={2}>
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
            <Grid item xs={6} sm={4} md={2}>
              <StatCard
                title="My Assigned"
                value={stats.myAssigned}
                icon={<AssignmentIcon />}
                color="#9c27b0"
              />
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
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

      {/* Quick Actions - Single Row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Report Issue - For ALL ROLES including Officer */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ textAlign: "center", p: 2 }}>
            <CardContent>
              <AddIcon sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Report Issue
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate("/complaints/new")}
                fullWidth
              >
                New Complaint
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* View Complaints */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ textAlign: "center", p: 2 }}>
            <CardContent>
              <ListIcon sx={{ fontSize: 40, color: "secondary.main", mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                View Complaints
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<ListIcon />}
                onClick={() => navigate("/complaints")}
                fullWidth
              >
                Manage
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Analytics */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ textAlign: "center", p: 2 }}>
            <CardContent>
              <AnalyticsIcon sx={{ fontSize: 40, color: "info.main", mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Analytics
              </Typography>
              <Button
                variant="contained"
                color="info"
                startIcon={<AnalyticsIcon />}
                onClick={() => navigate("/analytics")}
                fullWidth
              >
                View Stats
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Admin Tools - Compact */}
      {user?.roles?.includes("Admin") && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Admin Tools
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate("/users")}
              startIcon={<PeopleIcon />}
            >
              Users
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate("/analytics")}
              startIcon={<AnalyticsIcon />}
            >
              Analytics
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate("/audit")}
              startIcon={<HistoryIcon />}
            >
              Audit
            </Button>
          </Box>
        </Paper>
      )}

      {/* Officer Tools - Compact */}
      {user?.roles?.includes("Officer") && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Officer Tools
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate("/complaints")}
              startIcon={<AssignmentIcon />}
            >
              Complaints
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate("/analytics")}
              startIcon={<AnalyticsIcon />}
            >
              Analytics
            </Button>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default Dashboard;
