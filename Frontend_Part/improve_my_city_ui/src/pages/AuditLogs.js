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
  Typography,
  Box,
  Alert,
  CircularProgress,
  TextField,
  Button,
  Chip,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { auditService } from "../services/auditService";

const AuditLogs = () => {
  const { user } = useAuth();
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    userId: "",
    actionType: "",
    fromDate: "",
    toDate: "",
  });

  useEffect(() => {
    if (user?.roles?.includes("Admin")) {
      fetchAuditLogs();
    }
  }, [user]);

  // Fetch audit logs from API
  const fetchAuditLogs = async (filterParams = {}) => {
    try {
      setLoading(true);
      setError("");

      const response = await auditService.getAuditLogs(filterParams);
      if (response.success) {
        setAuditLogs(response.data);
      } else {
        setError(response.message || "Failed to load audit logs");
      }
    } catch (error) {
      console.error("Fetch audit logs error:", error);
      setError(error.message || "Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    fetchAuditLogs(filters);
  };

  const handleReset = () => {
    setFilters({
      userId: "",
      actionType: "",
      fromDate: "",
      toDate: "",
    });
    fetchAuditLogs();
  };

  const getActionTypeColor = (actionType) => {
    switch (actionType) {
      case "Login":
        return "success";
      case "CreateComplaint":
        return "primary";
      case "UpdateComplaintStatus":
        return "warning";
      case "DeleteComplaint":
        return "error";
      case "Register":
        return "info";
      default:
        return "default";
    }
  };

  if (!user?.roles?.includes("Admin")) {
    return (
      <Container>
        <Alert severity="error">
          Access denied. Admin privileges required.
        </Alert>
      </Container>
    );
  }

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
      <Typography variant="h4" gutterBottom>
        Audit Logs
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Quick Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Logs
              </Typography>
              <Typography variant="h4">{auditLogs.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Today
              </Typography>
              <Typography variant="h4" color="primary.main">
                {
                  auditLogs.filter((log) => {
                    const logDate = new Date(log.timestamp);
                    const today = new Date();
                    return logDate.toDateString() === today.toDateString();
                  }).length
                }
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                This Week
              </Typography>
              <Typography variant="h4" color="secondary.main">
                {
                  auditLogs.filter((log) => {
                    const logDate = new Date(log.timestamp);
                    const weekAgo = new Date(
                      Date.now() - 7 * 24 * 60 * 60 * 1000
                    );
                    return logDate >= weekAgo;
                  }).length
                }
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Unique Users
              </Typography>
              <Typography variant="h4" color="success.main">
                {new Set(auditLogs.map((log) => log.userName)).size}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          <FilterIcon sx={{ verticalAlign: "middle", mr: 1 }} />
          Filter Logs
        </Typography>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="User ID"
              value={filters.userId}
              onChange={(e) => handleFilterChange("userId", e.target.value)}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Action Type"
              value={filters.actionType}
              onChange={(e) => handleFilterChange("actionType", e.target.value)}
              size="small"
            >
              <option value="">All Actions</option>
              <option value="Login">Login</option>
              <option value="Register">Register</option>
              <option value="CreateComplaint">Create Complaint</option>
              <option value="UpdateComplaintStatus">Update Status</option>
              <option value="DeleteComplaint">Delete Complaint</option>
              <option value="AddComment">Add Comment</option>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="From Date"
              type="date"
              value={filters.fromDate}
              onChange={(e) => handleFilterChange("fromDate", e.target.value)}
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="To Date"
              type="date"
              value={filters.toDate}
              onChange={(e) => handleFilterChange("toDate", e.target.value)}
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Box display="flex" gap={1}>
              <Button
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={handleSearch}
                fullWidth
              >
                Search
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleReset}
              >
                Reset
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Audit Logs Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Action Type</TableCell>
              <TableCell>Entity</TableCell>
              <TableCell>Entity ID</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>IP Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {auditLogs.map((log) => (
              <TableRow key={log.id} hover>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(log.timestamp).toLocaleDateString()}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {log.userName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={log.actionType}
                    color={getActionTypeColor(log.actionType)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{log.entity}</TableCell>
                <TableCell>
                  {log.entityId ? `#${log.entityId}` : "N/A"}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{log.description}</Typography>
                </TableCell>
                <TableCell>
                  <Chip label={log.ipAddress} variant="outlined" size="small" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {auditLogs.length === 0 && (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" color="textSecondary">
              No audit logs found
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              {Object.values(filters).some((filter) => filter)
                ? "Try adjusting your filters"
                : "No activity recorded yet"}
            </Typography>
          </Box>
        )}
      </TableContainer>

      {/* Pagination Info */}
      <Box
        sx={{
          mt: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="body2" color="textSecondary">
          Showing {auditLogs.length} logs
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Last updated: {new Date().toLocaleString()}
        </Typography>
      </Box>
    </Container>
  );
};

export default AuditLogs;
