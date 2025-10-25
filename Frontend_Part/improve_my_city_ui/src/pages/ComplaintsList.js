import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  Box,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  TextField,
  MenuItem,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { complaintService } from "../services/complaintService";

const ComplaintsList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [allComplaints, setAllComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await complaintService.getComplaints();

      if (response.success) {
        setAllComplaints(response.data);
        filterComplaints(response.data, tabValue);
      } else {
        setError(response.message || "Failed to load complaints");
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
      setError(error.message || "Failed to load complaints. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filterComplaints = (complaintsList, tabIndex) => {
    let filtered = complaintsList;

    if (user?.roles?.includes("Officer")) {
      switch (tabIndex) {
        case 0: // My Assigned
          filtered = complaintsList.filter(
            (c) => c.assignedTo?.userId === user.userId
          );
          break;
        case 1: // Pending (Unassigned)
          filtered = complaintsList.filter(
            (c) => c.status === "Pending" && !c.assignedTo
          );
          break;
        case 2: // All Visible
          filtered = complaintsList.filter(
            (c) =>
              c.assignedTo?.userId === user.userId ||
              c.status === "Pending" ||
              c.createdBy?.userId === user.userId
          );
          break;
        default:
          filtered = complaintsList;
      }
    } else if (user?.roles?.includes("User")) {
      // User can only see their own complaints
      filtered = complaintsList.filter(
        (c) => c.createdBy?.userId === user.userId
      );
    }
    // Admin sees all complaints by default

    setComplaints(filtered);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    filterComplaints(allComplaints, newValue);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this complaint?")) {
      try {
        const response = await complaintService.deleteComplaint(id);
        if (response.success) {
          setAllComplaints(
            allComplaints.filter((complaint) => complaint.id !== id)
          );
          filterComplaints(
            allComplaints.filter((complaint) => complaint.id !== id),
            tabValue
          );
        }
      } catch (error) {
        setError(error.message || "Failed to delete complaint");
      }
    }
  };

  const handleAssignToMe = async (complaintId) => {
    try {
      const response = await complaintService.updateComplaintStatus(
        complaintId,
        {
          status: "InProgress",
        }
      );
      if (response.success) {
        // Refresh complaints
        await fetchComplaints();
      }
    } catch (error) {
      setError(error.message || "Failed to assign complaint");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "warning";
      case "InProgress":
        return "info";
      case "Resolved":
        return "success";
      case "Rejected":
        return "error";
      default:
        return "default";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 1:
        return "success";
      case 2:
        return "info";
      case 3:
        return "warning";
      case 4:
        return "error";
      default:
        return "default";
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 1:
        return "Low";
      case 2:
        return "Medium";
      case 3:
        return "High";
      case 4:
        return "Critical";
      default:
        return "Unknown";
    }
  };

  const finalComplaints = complaints.filter((complaint) => {
    const matchesFilter = filter === "all" || complaint.status === filter;
    const matchesSearch =
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Officer ke liye statistics
  const officerStats = user?.roles?.includes("Officer")
    ? {
        assigned: allComplaints.filter(
          (c) => c.assignedTo?.userId === user.userId
        ).length,
        pending: allComplaints.filter(
          (c) => c.status === "Pending" && !c.assignedTo
        ).length,
        resolved: allComplaints.filter(
          (c) => c.assignedTo?.userId === user.userId && c.status === "Resolved"
        ).length,
      }
    : null;

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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">
          {user?.roles?.includes("Admin")
            ? "All Complaints"
            : user?.roles?.includes("Officer")
            ? "Complaints Dashboard"
            : "My Complaints"}
        </Typography>

        <Box display="flex" gap={2}>
          <Button
            startIcon={<RefreshIcon />}
            onClick={fetchComplaints}
            variant="outlined"
          >
            Refresh
          </Button>

          {/* Only show "New Complaint" button for Users and Admin */}
          {(user?.roles?.includes("User") ||
            user?.roles?.includes("Admin")) && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/complaints/new")}
            >
              New Complaint
            </Button>
          )}
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Officer Statistics */}
      {user?.roles?.includes("Officer") && officerStats && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  My Assigned
                </Typography>
                <Typography variant="h4" color="primary.main">
                  {officerStats.assigned}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Pending (Unassigned)
                </Typography>
                <Typography variant="h4" color="warning.main">
                  {officerStats.pending}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  My Resolved
                </Typography>
                <Typography variant="h4" color="success.main">
                  {officerStats.resolved}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Officer Tabs */}
      {user?.roles?.includes("Officer") && (
        <Paper sx={{ mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label={`My Assigned (${officerStats?.assigned || 0})`} />
            <Tab label={`Pending Complaints (${officerStats?.pending || 0})`} />
            <Tab label="All Visible Complaints" />
          </Tabs>
        </Paper>
      )}

      {/* Filters and Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
          <TextField
            label="Search complaints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 200 }}
            size="small"
          />
          <TextField
            select
            label="Filter by status"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            sx={{ minWidth: 150 }}
            size="small"
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="InProgress">In Progress</MenuItem>
            <MenuItem value="Resolved">Resolved</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
          </TextField>

          <Typography variant="body2" color="textSecondary">
            Showing {finalComplaints.length} of {allComplaints.length}{" "}
            complaints
          </Typography>
        </Box>
      </Paper>

      {/* Complaints Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title & Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell>Reported By</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {finalComplaints.map((complaint) => (
              <TableRow key={complaint.id} hover>
                <TableCell>#{complaint.id}</TableCell>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {complaint.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {complaint.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={complaint.category}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={getPriorityText(complaint.priority)}
                    color={getPriorityColor(complaint.priority)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={complaint.status}
                    color={getStatusColor(complaint.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {complaint.createdBy?.fullName || "Unknown"}
                </TableCell>
                <TableCell>
                  {complaint.assignedTo?.fullName || "Not assigned"}
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => navigate(`/complaints/${complaint.id}`)}
                      title="View Details"
                    >
                      <ViewIcon />
                    </IconButton>

                    {/* Officer can assign pending complaints to themselves */}
                    {user?.roles?.includes("Officer") &&
                      complaint.status === "Pending" &&
                      !complaint.assignedTo && (
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleAssignToMe(complaint.id)}
                          title="Assign to me"
                        >
                          <AssignmentIcon />
                        </IconButton>
                      )}

                    {/* Admin and complaint creator can edit/delete */}
                    {(user?.roles?.includes("Admin") ||
                      complaint.createdBy?.userId === user?.userId) && (
                      <>
                        <IconButton
                          size="small"
                          color="secondary"
                          onClick={() =>
                            navigate(`/complaints/${complaint.id}/edit`)
                          }
                          title="Edit Complaint"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(complaint.id)}
                          title="Delete Complaint"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {finalComplaints.length === 0 && (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No complaints found
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              {user?.roles?.includes("Officer") &&
                tabValue === 0 &&
                "You don't have any assigned complaints."}
              {user?.roles?.includes("Officer") &&
                tabValue === 1 &&
                "There are no pending complaints available."}
              {user?.roles?.includes("User") &&
                "You haven't created any complaints yet."}
              {user?.roles?.includes("Admin") &&
                "No complaints found in the system."}
            </Typography>
            {user?.roles?.includes("User") && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate("/complaints/new")}
              >
                Create Your First Complaint
              </Button>
            )}
          </Box>
        )}
      </TableContainer>
    </Container>
  );
};

export default ComplaintsList;
