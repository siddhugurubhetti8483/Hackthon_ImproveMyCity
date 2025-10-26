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
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  TextField,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import {
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  People as PeopleIcon,
  Security as SecurityIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { userService } from "../services/userService";

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [roleDialog, setRoleDialog] = useState({
    open: false,
    user: null,
    newRole: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    if (currentUser?.roles?.includes("Admin")) {
      fetchUsers();
    }
  }, [currentUser]);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await userService.getUsers();
      if (response.success) {
        setUsers(response.data);
      } else {
        setError(response.message || "Failed to load users");
      }
    } catch (error) {
      console.error("Fetch users error:", error);
      setError(error.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // Open role change dialog
  const handleRoleChange = (user, newRole) => {
    setRoleDialog({ open: true, user, newRole });
  };

  // Confirm role change via API
  const confirmRoleChange = async () => {
    try {
      // ACTUAL API CALL
      const response = await userService.updateUserRole(
        roleDialog.user.userId,
        roleDialog.newRole
      );
      if (response.success) {
        setUsers(
          users.map((user) =>
            user.userId === roleDialog.user.userId
              ? { ...user, roles: [roleDialog.newRole] }
              : user
          )
        );
        setRoleDialog({ open: false, user: null, newRole: "" });
      } else {
        setError(response.message || "Failed to update user role");
      }
    } catch (error) {
      console.error("Update role error:", error);
      setError(error.message || "Failed to update user role");
    }
  };

  // Toggle user active/inactive status via API
  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      // ACTUAL API CALL
      const response = await userService.updateUserStatus(
        userId,
        !currentStatus
      );
      if (response.success) {
        setUsers(
          users.map((user) =>
            user.userId === userId
              ? { ...user, isActive: !currentStatus }
              : user
          )
        );
      } else {
        setError(response.message || "Failed to update user status");
      }
    } catch (error) {
      console.error("Toggle status error:", error);
      setError(error.message || "Failed to update user status");
    }
  };

  // Filter users based on search and role
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.roles.includes(roleFilter);
    return matchesSearch && matchesRole;
  });

  // Statistics
  const stats = {
    total: users.length,
    active: users.filter((u) => u.isActive).length,
    admins: users.filter((u) => u.roles.includes("Admin")).length,
    officers: users.filter((u) => u.roles.includes("Officer")).length,
    users: users.filter((u) => u.roles.includes("User")).length,
    mfaEnabled: users.filter((u) => u.isMFAEnabled).length,
  };

  // Access control
  if (!currentUser?.roles?.includes("Admin")) {
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
        User Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: "center", p: 2 }}>
              <PeopleIcon sx={{ color: "primary.main", mb: 1 }} />
              <Typography variant="h6">{stats.total}</Typography>
              <Typography variant="body2" color="textSecondary">
                Total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: "center", p: 2 }}>
              <CheckCircleIcon sx={{ color: "success.main", mb: 1 }} />
              <Typography variant="h6">{stats.active}</Typography>
              <Typography variant="body2" color="textSecondary">
                Active
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: "center", p: 2 }}>
              <SecurityIcon sx={{ color: "error.main", mb: 1 }} />
              <Typography variant="h6">{stats.admins}</Typography>
              <Typography variant="body2" color="textSecondary">
                Admins
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: "center", p: 2 }}>
              <PeopleIcon sx={{ color: "warning.main", mb: 1 }} />
              <Typography variant="h6">{stats.officers}</Typography>
              <Typography variant="body2" color="textSecondary">
                Officers
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: "center", p: 2 }}>
              <PeopleIcon sx={{ color: "info.main", mb: 1 }} />
              <Typography variant="h6">{stats.users}</Typography>
              <Typography variant="body2" color="textSecondary">
                Users
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card>
            <CardContent sx={{ textAlign: "center", p: 2 }}>
              <SecurityIcon sx={{ color: "success.main", mb: 1 }} />
              <Typography variant="h6">{stats.mfaEnabled}</Typography>
              <Typography variant="body2" color="textSecondary">
                MFA Enabled
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filter Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Filter by role"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              size="small"
            >
              <MenuItem value="all">All Roles</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Officer">Officer</MenuItem>
              <MenuItem value="User">User</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="body2" color="textSecondary">
              Showing {filteredUsers.length} of {users.length} users
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Button variant="outlined" onClick={fetchUsers} fullWidth>
              Refresh
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Users Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>MFA</TableCell>
              <TableCell>Last Login</TableCell>
              <TableCell>Member Since</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.userId} hover>
                <TableCell>
                  <Typography fontWeight="bold">{user.fullName}</Typography>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <TextField
                    select
                    size="small"
                    value={user.roles[0] || "User"}
                    onChange={(e) => handleRoleChange(user, e.target.value)}
                    sx={{ minWidth: 120 }}
                  >
                    <MenuItem value="Admin">Admin</MenuItem>
                    <MenuItem value="Officer">Officer</MenuItem>
                    <MenuItem value="User">User</MenuItem>
                  </TextField>
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.isActive ? "Active" : "Inactive"}
                    color={user.isActive ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.isMFAEnabled ? "Enabled" : "Disabled"}
                    color={user.isMFAEnabled ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {user.lastLoginDate
                    ? new Date(user.lastLoginDate).toLocaleDateString()
                    : "Never"}
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <IconButton
                      size="small"
                      color={user.isActive ? "error" : "success"}
                      onClick={() =>
                        toggleUserStatus(user.userId, user.isActive)
                      }
                      disabled={user.userId === currentUser.userId}
                      title={user.isActive ? "Deactivate" : "Activate"}
                    >
                      {user.isActive ? <BlockIcon /> : <CheckCircleIcon />}
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}

            {filteredUsers.length === 0 && (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="h6" color="textSecondary">
                  No users found
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mt: 1 }}
                >
                  {searchTerm || roleFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "No users in the system"}
                </Typography>
              </Box>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Role Change Confirmation Dialog */}
      <Dialog
        open={roleDialog.open}
        onClose={() => setRoleDialog({ open: false, user: null, newRole: "" })}
      >
        <DialogTitle>Confirm Role Change</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to change{" "}
            <strong>{roleDialog.user?.fullName}</strong>'s role to{" "}
            <strong>{roleDialog.newRole}</strong>?
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            This will affect their permissions and access levels in the system.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setRoleDialog({ open: false, user: null, newRole: "" })
            }
          >
            Cancel
          </Button>
          <Button
            onClick={confirmRoleChange}
            variant="contained"
            color="primary"
          >
            Confirm Change
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserManagement;
