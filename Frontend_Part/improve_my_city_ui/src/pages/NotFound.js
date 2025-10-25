import React from "react";
import { Container, Box, Typography, Button, Paper, Grid } from "@mui/material";
import {
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
  ReportProblem as ReportProblemIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "70vh",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 6,
            textAlign: "center",
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <ReportProblemIcon
                sx={{
                  fontSize: 120,
                  color: "primary.main",
                  mb: 2,
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography
                variant="h1"
                component="h1"
                gutterBottom
                color="primary"
                fontWeight="bold"
                sx={{ fontSize: { xs: "4rem", md: "6rem" } }}
              >
                404
              </Typography>

              <Typography
                variant="h4"
                component="h2"
                gutterBottom
                fontWeight="medium"
              >
                Page Not Found
              </Typography>

              <Typography
                variant="body1"
                color="textSecondary"
                sx={{
                  mb: 4,
                  maxWidth: "400px",
                  lineHeight: 1.6,
                }}
              >
                Oops! The page you're looking for seems to have wandered off. It
                might have been moved, deleted, or you entered the wrong URL.
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate(-1)}
                  size="large"
                  sx={{ px: 4 }}
                >
                  Go Back
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<HomeIcon />}
                  onClick={() => navigate("/dashboard")}
                  size="large"
                  sx={{ px: 4 }}
                >
                  Go to Dashboard
                </Button>
              </Box>

              {/* Additional Help */}
              <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: "divider" }}>
                <Typography variant="body2" color="textSecondary">
                  Need help?{" "}
                  <Button
                    color="primary"
                    size="small"
                    onClick={() => navigate("/")}
                    sx={{ textTransform: "none" }}
                  >
                    Visit our homepage
                  </Button>{" "}
                  or{" "}
                  <Button
                    color="primary"
                    size="small"
                    onClick={() => navigate("/complaints")}
                    sx={{ textTransform: "none" }}
                  >
                    check your complaints
                  </Button>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default NotFound;
