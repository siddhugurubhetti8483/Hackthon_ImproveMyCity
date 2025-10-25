import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Button,
  Alert,
  CircularProgress,
  TextField,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Comment as CommentIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { complaintService } from "../services/complaintService";

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const [updateDialog, setUpdateDialog] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({
    status: "",
    resolutionNotes: "",
  });

  useEffect(() => {
    fetchComplaintDetails();
  }, [id]);

  const fetchComplaintDetails = async () => {
    try {
      setLoading(true);
      const response = await complaintService.getComplaintById(id);
      if (response.success) {
        setComplaint(response.data);
      } else {
        setError("Complaint not found");
      }
    } catch (error) {
      setError(error.message || "Failed to load complaint details");
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;

    setAddingComment(true);
    try {
      const response = await complaintService.addComment(id, { comment });
      if (response.success) {
        setComment("");
        fetchComplaintDetails(); // Refresh comments
      }
    } catch (error) {
      setError(error.message || "Failed to add comment");
    } finally {
      setAddingComment(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      const response = await complaintService.updateComplaintStatus(
        id,
        statusUpdate
      );
      if (response.success) {
        setUpdateDialog(false);
        setStatusUpdate({ status: "", resolutionNotes: "" });
        fetchComplaintDetails();
      }
    } catch (error) {
      setError(error.message || "Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this complaint?")) {
      try {
        const response = await complaintService.deleteComplaint(id);
        if (response.success) {
          navigate("/complaints", {
            state: { message: "Complaint deleted successfully!" },
          });
        }
      } catch (error) {
        setError(error.message || "Failed to delete complaint");
      }
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

  if (!complaint) {
    return (
      <Container>
        <Alert severity="error">Complaint not found</Alert>
      </Container>
    );
  }

  const canEdit =
    user?.roles?.includes("Admin") ||
    complaint.createdBy.userId === user?.userId;
  const canUpdateStatus =
    user?.roles?.includes("Admin") || user?.roles?.includes("Officer");

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header with Actions */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        mb={3}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            {complaint.title}
          </Typography>
          <Box display="flex" gap={1} alignItems="center">
            <Chip
              label={complaint.status}
              color={getStatusColor(complaint.status)}
              size="small"
            />
            <Typography variant="body2" color="textSecondary">
              ID: #{complaint.id}
            </Typography>
          </Box>
        </Box>

        <Box display="flex" gap={1}>
          {canUpdateStatus && (
            <Button
              variant="outlined"
              startIcon={<AssignmentIcon />}
              onClick={() => setUpdateDialog(true)}
            >
              Update Status
            </Button>
          )}
          {canEdit && (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/complaints/${id}/edit`)}
            >
              Edit
            </Button>
          )}
          {canEdit && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
            >
              Delete
            </Button>
          )}
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Complaint Details */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" paragraph>
              {complaint.description}
            </Typography>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Category
                </Typography>
                <Typography variant="body1">{complaint.category}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Priority
                </Typography>
                <Typography variant="body1">
                  {complaint.priority === 1
                    ? "Low"
                    : complaint.priority === 2
                    ? "Medium"
                    : complaint.priority === 3
                    ? "High"
                    : "Critical"}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Location
                </Typography>
                <Typography variant="body1">{complaint.location}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Created Date
                </Typography>
                <Typography variant="body1">
                  {new Date(complaint.createdAt).toLocaleString()}
                </Typography>
              </Grid>
            </Grid>

            {complaint.resolutionNotes && (
              <Box sx={{ mt: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Resolution Notes
                </Typography>
                <Typography variant="body1">
                  {complaint.resolutionNotes}
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Comments Section */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Comments & Activity
            </Typography>

            {/* Add Comment */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <Box sx={{ mt: 1, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  startIcon={<CommentIcon />}
                  onClick={handleAddComment}
                  disabled={addingComment || !comment.trim()}
                >
                  {addingComment ? (
                    <CircularProgress size={20} />
                  ) : (
                    "Add Comment"
                  )}
                </Button>
              </Box>
            </Box>

            {/* Comments List */}
            <List>
              {complaint.comments.map((comment) => (
                <ListItem key={comment.id} alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="subtitle1">
                          {comment.user.fullName}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {new Date(comment.createdAt).toLocaleString()}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {comment.comment}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}

              {complaint.comments.length === 0 && (
                <Typography
                  variant="body2"
                  color="textSecondary"
                  align="center"
                  sx={{ py: 3 }}
                >
                  No comments yet. Be the first to comment!
                </Typography>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Complaint Information
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Reported By
                </Typography>
                <Typography variant="body1">
                  {complaint.createdBy.fullName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {complaint.createdBy.email}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Assigned To
                </Typography>
                <Typography variant="body1">
                  {complaint.assignedTo?.fullName || "Not assigned"}
                </Typography>
                {complaint.assignedTo?.email && (
                  <Typography variant="body2" color="textSecondary">
                    {complaint.assignedTo.email}
                  </Typography>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Last Updated
                </Typography>
                <Typography variant="body1">
                  {complaint.updatedAt
                    ? new Date(complaint.updatedAt).toLocaleString()
                    : new Date(complaint.createdAt).toLocaleString()}
                </Typography>
              </Box>

              {complaint.resolvedAt && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Resolved Date
                    </Typography>
                    <Typography variant="body1">
                      {new Date(complaint.resolvedAt).toLocaleString()}
                    </Typography>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Update Status Dialog */}
      <Dialog
        open={updateDialog}
        onClose={() => setUpdateDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Complaint Status</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Status"
            value={statusUpdate.status}
            onChange={(e) =>
              setStatusUpdate({ ...statusUpdate, status: e.target.value })
            }
            sx={{ mt: 2 }}
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="InProgress">In Progress</MenuItem>
            <MenuItem value="Resolved">Resolved</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
          </TextField>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Resolution Notes"
            value={statusUpdate.resolutionNotes}
            onChange={(e) =>
              setStatusUpdate({
                ...statusUpdate,
                resolutionNotes: e.target.value,
              })
            }
            sx={{ mt: 2 }}
            placeholder="Add any notes about the resolution..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateDialog(false)}>Cancel</Button>
          <Button
            onClick={handleStatusUpdate}
            variant="contained"
            disabled={!statusUpdate.status}
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ComplaintDetails;
