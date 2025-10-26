import React from "react";
import {
  Paper,
  Typography,
  Box,
  Button,
  Container,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const FormContainer = ({
  title,
  children,
  onSubmit,
  submitLabel = "Save Changes",
  cancelLabel = "Cancel",
  loading = false,
  maxWidth = "md",
  steps = [],
  activeStep = 0,
  showBackButton = true,
}) => {
  const navigate = useNavigate();

  return (
    <Container component="main" maxWidth={maxWidth} sx={{ mt: 2, mb: 4 }}>
      <Paper
        elevation={1}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        {/* Header with Back Button */}
        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 4 }}>
          {showBackButton && (
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{ mr: 2, minWidth: "auto" }}
              disabled={loading}
              size="small"
              variant="text"
            >
              Back
            </Button>
          )}
          <Typography
            component="h1"
            variant="h4"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              color: "primary.main",
              textAlign: showBackButton ? "left" : "center",
            }}
          >
            {title}
          </Typography>
        </Box>

        {/* Stepper for multi-step forms */}
        {steps.length > 0 && (
          <Box sx={{ mb: 4, width: "100%" }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel
                    StepIconProps={{
                      sx: {
                        color:
                          index <= activeStep ? "primary.main" : "grey.400",
                      },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        )}

        <form onSubmit={onSubmit}>
          {children}

          {/* Form Actions */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: steps.length > 0 ? "space-between" : "flex-end",
              mt: 4,
              pt: 3,
              borderTop: 1,
              borderColor: "divider",
            }}
          >
            {steps.length > 0 && activeStep > 0 ? (
              <Button
                type="button"
                variant="outlined"
                onClick={() => {
                  /* Handle back step */
                }}
                disabled={loading}
                size="large"
                sx={{ minWidth: 120 }}
              >
                Previous
              </Button>
            ) : (
              <Button
                type="button"
                variant="outlined"
                onClick={() => navigate(-1)}
                disabled={loading}
                size="large"
                sx={{ minWidth: 120 }}
              >
                {cancelLabel}
              </Button>
            )}

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              size="large"
              sx={{ minWidth: 140 }}
            >
              {loading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={16} color="inherit" />
                  Processing...
                </Box>
              ) : (
                submitLabel
              )}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default FormContainer;
