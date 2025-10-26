import React from "react";
import { Box, Typography, Button, Container, Paper } from "@mui/material";
import {
  ReportProblem as ReportProblemIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // You can also log the error to an error reporting service
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = "/dashboard";
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
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
                background: "linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)",
                borderRadius: 3,
              }}
            >
              <ReportProblemIcon
                sx={{
                  fontSize: 80,
                  color: "error.main",
                  mb: 3,
                }}
              />

              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                color="error"
                fontWeight="bold"
              >
                Oops! Something went wrong
              </Typography>

              <Typography
                variant="h6"
                component="h2"
                gutterBottom
                color="text.secondary"
                sx={{ mb: 3 }}
              >
                We encountered an unexpected error. Please try again.
              </Typography>

              {process.env.NODE_ENV === "development" && (
                <Paper
                  sx={{
                    p: 2,
                    mb: 3,
                    textAlign: "left",
                    backgroundColor: "grey.100",
                    maxHeight: 200,
                    overflow: "auto",
                  }}
                >
                  <Typography variant="body2" fontFamily="monospace">
                    {this.state.error && this.state.error.toString()}
                  </Typography>
                </Paper>
              )}

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
                  color="primary"
                  startIcon={<RefreshIcon />}
                  onClick={this.handleReload}
                  size="large"
                  sx={{ px: 4 }}
                >
                  Reload Page
                </Button>

                <Button
                  variant="outlined"
                  color="primary"
                  onClick={this.handleReset}
                  size="large"
                  sx={{ px: 4 }}
                >
                  Go to Dashboard
                </Button>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
                If the problem persists, please contact support.
              </Typography>
            </Paper>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
