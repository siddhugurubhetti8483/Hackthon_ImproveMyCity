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
} from "@mui/material";
import {
  Edit as EditIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
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

  useEffect(() => {
    if (currentUser?.roles?.includes("Admin")) {
      fetchUsers();
    }
  }, [currentUser]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getUsers();
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      setError(error.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (user, newRole) => {
    setRoleDialog({ open: true, user, newRole });
  };

  const confirmRoleChange = async () => {
    try {
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
      }
    } catch (error) {
      setError(error.message || "Failed to update user role");
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
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
      }
    } catch (error) {
      setError(error.message || "Failed to update user status");
    }
  };

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
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.userId}>
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
                  <Box display="flex" gap={1}>
                    <IconButton
                      size="small"
                      color={user.isActive ? "error" : "success"}
                      onClick={() =>
                        toggleUserStatus(user.userId, user.isActive)
                      }
                      disabled={user.userId === currentUser.userId}
                    >
                      {user.isActive ? <BlockIcon /> : <CheckCircleIcon />}
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
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
            Are you sure you want to change {roleDialog.user?.fullName}'s role
            to {roleDialog.newRole}?
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
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserManagement;
