import React, { useState } from "react";
import {
  TextField,
  Typography,
  Box,
  Alert,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { complaintService } from "../services/complaintService";
import FormContainer from "../components/common/FormContainer";
import AppButton from "../components/common/AppButton";

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
  const { id } = useParams();
  const isEdit = Boolean(id);

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
      priority: 2,
      imageUrl: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError("");
      try {
        let response;

        if (isEdit) {
          response = await complaintService.updateComplaint(id, values);
        } else {
          response = await complaintService.createComplaint(values);
        }

        if (response.success) {
          navigate("/complaints", {
            state: {
              message: `Complaint ${
                isEdit ? "updated" : "created"
              } successfully!`,
              type: "success",
            },
          });
        } else {
          setError(
            response.message ||
              `Failed to ${isEdit ? "update" : "create"} complaint`
          );
        }
      } catch (error) {
        setError(
          error.message || `Failed to ${isEdit ? "update" : "create"} complaint`
        );
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <FormContainer
      title={isEdit ? "Edit Complaint" : "Report New Issue"}
      onSubmit={formik.handleSubmit}
      submitLabel={
        loading
          ? "Processing..."
          : isEdit
          ? "Update Complaint"
          : "Submit Complaint"
      }
      cancelLabel="Cancel"
      loading={loading}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="title"
            name="title"
            label="Issue Title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
            placeholder="Brief description of the issue (e.g., 'Broken streetlight on Main St')"
            variant="outlined"
            size="medium"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            id="description"
            name="description"
            label="Detailed Description"
            multiline
            rows={4}
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
            placeholder="Please provide detailed information about the issue, including any specific locations, times, and impacts..."
            variant="outlined"
            size="medium"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            id="location"
            name="location"
            label="Exact Location"
            value={formik.values.location}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.location && Boolean(formik.errors.location)}
            helperText={formik.touched.location && formik.errors.location}
            placeholder="Street address, landmark, or specific location details"
            variant="outlined"
            size="medium"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl
            fullWidth
            error={formik.touched.category && Boolean(formik.errors.category)}
          >
            <InputLabel id="category-label">Issue Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              name="category"
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="Issue Category"
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.category && formik.errors.category && (
              <FormHelperText>{formik.errors.category}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl
            fullWidth
            error={formik.touched.priority && Boolean(formik.errors.priority)}
          >
            <InputLabel id="priority-label">Priority Level</InputLabel>
            <Select
              labelId="priority-label"
              id="priority"
              name="priority"
              value={formik.values.priority}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="Priority Level"
            >
              <MenuItem value={1}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: "success.main",
                    }}
                  />
                  Low - Minor inconvenience
                </Box>
              </MenuItem>
              <MenuItem value={2}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: "warning.main",
                    }}
                  />
                  Medium - Needs attention
                </Box>
              </MenuItem>
              <MenuItem value={3}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: "orange",
                    }}
                  />
                  High - Significant impact
                </Box>
              </MenuItem>
              <MenuItem value={4}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor: "error.main",
                    }}
                  />
                  Critical - Safety hazard
                </Box>
              </MenuItem>
            </Select>
            {formik.touched.priority && formik.errors.priority && (
              <FormHelperText>{formik.errors.priority}</FormHelperText>
            )}
          </FormControl>
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
            error={formik.touched.imageUrl && Boolean(formik.errors.imageUrl)}
            helperText={formik.touched.imageUrl && formik.errors.imageUrl}
            placeholder="https://example.com/image.jpg"
            variant="outlined"
            size="medium"
          />
        </Grid>

        {/* Form Tips */}
        <Grid item xs={12}>
          <Box
            sx={{
              p: 3,
              bgcolor: "info.50",
              borderRadius: 2,
              border: 1,
              borderColor: "info.100",
            }}
          >
            <Typography
              variant="h6"
              color="info.dark"
              fontWeight="600"
              gutterBottom
            >
              💡 Tips for Better Complaint Resolution
            </Typography>
            <Typography variant="body2" color="info.dark" sx={{ mb: 1 }}>
              • <strong>Be specific</strong> about the location and issue
              details
            </Typography>
            <Typography variant="body2" color="info.dark" sx={{ mb: 1 }}>
              • <strong>Include photos</strong> if possible for better
              understanding
            </Typography>
            <Typography variant="body2" color="info.dark" sx={{ mb: 1 }}>
              • <strong>Choose appropriate priority</strong> based on impact
            </Typography>
            <Typography variant="body2" color="info.dark">
              • <strong>Provide clear contact information</strong> for follow-up
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </FormContainer>
  );
};

export default CreateComplaint;
