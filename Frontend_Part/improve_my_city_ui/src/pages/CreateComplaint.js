import React, { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { complaintService } from "../services/complaintService";

const validationSchema = yup.object({
  title: yup
    .string()
    .min(5, "Title should be at least 5 characters")
    .max(200, "Title should not exceed 200 characters")
    .required("Title is required"),
  description: yup
    .string()
    .min(10, "Description should be at least 10 characters")
    .max(1000, "Description should not exceed 1000 characters")
    .required("Description is required"),
  location: yup
    .string()
    .max(500, "Location should not exceed 500 characters")
    .required("Location is required"),
  category: yup.string().required("Category is required"),
  priority: yup
    .number()
    .min(1, "Priority must be at least 1")
    .max(4, "Priority must be at most 4")
    .required("Priority is required"),
});

const CreateComplaint = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const categories = [
    "Pothole",
    "Garbage",
    "Streetlight",
    "Water Supply",
    "Sewage",
    "Road Damage",
    "Public Transport",
    "Parks & Gardens",
    "Noise Pollution",
    "Other",
  ];

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      location: "",
      category: "",
      priority: 1,
      imageUrl: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError("");
      try {
        const response = await complaintService.createComplaint(values);
        if (response.success) {
          navigate("/complaints", {
            state: { message: "Complaint created successfully!" },
          });
        } else {
          setError(response.message || "Failed to create complaint");
        }
      } catch (error) {
        setError(error.message || "Failed to create complaint");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Report a New Issue
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="title"
                name="title"
                label="Complaint Title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Description"
                multiline
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.description &&
                  Boolean(formik.errors.description)
                }
                helperText={
                  formik.touched.description && formik.errors.description
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="location"
                name="location"
                label="Location"
                value={formik.values.location}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.location && Boolean(formik.errors.location)
                }
                helperText={formik.touched.location && formik.errors.location}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                id="category"
                name="category"
                label="Category"
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.category && Boolean(formik.errors.category)
                }
                helperText={formik.touched.category && formik.errors.category}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                id="priority"
                name="priority"
                label="Priority"
                value={formik.values.priority}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.priority && Boolean(formik.errors.priority)
                }
                helperText={formik.touched.priority && formik.errors.priority}
              >
                <MenuItem value={1}>Low</MenuItem>
                <MenuItem value={2}>Medium</MenuItem>
                <MenuItem value={3}>High</MenuItem>
                <MenuItem value={4}>Critical</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="imageUrl"
                name="imageUrl"
                label="Image URL (Optional)"
                value={formik.values.imageUrl}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.imageUrl && Boolean(formik.errors.imageUrl)
                }
                helperText={formik.touched.imageUrl && formik.errors.imageUrl}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/complaints")}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="contained" disabled={loading}>
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Submit Complaint"
                  )}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateComplaint;
