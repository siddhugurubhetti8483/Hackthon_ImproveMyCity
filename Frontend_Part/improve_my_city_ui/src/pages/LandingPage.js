import React from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Paper,
  AppBar,
  Toolbar,
  Switch,
} from "@mui/material";
import {
  Report as ReportIcon,
  TrackChanges as TrackIcon,
  Visibility as VisibilityIcon,
  Security as SecurityIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const LandingPage = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  const features = [
    {
      icon: <ReportIcon sx={{ fontSize: 48, color: "primary.main" }} />,
      title: "Easy Reporting",
      description:
        "Quickly report civic issues with our simple and intuitive form.",
    },
    {
      icon: <TrackIcon sx={{ fontSize: 48, color: "secondary.main" }} />,
      title: "Real-time Tracking",
      description:
        "Track the progress of your complaints in real-time with status updates.",
    },
    {
      icon: <VisibilityIcon sx={{ fontSize: 48, color: "success.main" }} />,
      title: "Transparent Process",
      description:
        "Complete transparency in how complaints are handled and resolved.",
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 48, color: "warning.main" }} />,
      title: "Secure & Private",
      description:
        "Your data is protected with enterprise-grade security measures.",
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <AppBar position="static" color="transparent" elevation={1}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: "bold" }}
          >
            Improve My City
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Switch checked={isDarkMode} onChange={toggleTheme} />
              <Typography variant="body2">
                {isDarkMode ? "Dark" : "Light"}
              </Typography>
            </Box>
            <Button color="inherit" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button variant="contained" onClick={() => navigate("/register")}>
              Register
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Paper
        sx={{
          position: "relative",
          backgroundColor: "grey.800",
          color: "#fff",
          mb: 4,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7))",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              position: "relative",
              p: { xs: 3, md: 6 },
              pr: { md: 0 },
              minHeight: "60vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Typography
              component="h1"
              variant="h2"
              color="inherit"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              Improve Your City, One Report at a Time.
            </Typography>
            <Typography
              variant="h5"
              color="inherit"
              paragraph
              sx={{ maxWidth: "800px", mb: 4 }}
            >
              Report, Track, and Resolve Civic Issues with Ease and
              Transparency. Join thousands of citizens making their cities
              better.
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate("/register")}
                sx={{ px: 4, py: 1.5 }}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                size="large"
                color="inherit"
                onClick={() => navigate("/login")}
                sx={{ px: 4, py: 1.5 }}
              >
                Login
              </Button>
            </Box>
          </Box>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          gutterBottom
          align="center"
          sx={{ mb: 6, fontWeight: "bold" }}
        >
          Why Choose Improve My City?
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item key={index} xs={12} sm={6} md={3}>
              <Card sx={{ height: "100%", textAlign: "center", p: 2 }}>
                <CardContent>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography gutterBottom variant="h5" component="h3">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Stats Section */}
      <Paper sx={{ py: 8, backgroundColor: "primary.main", color: "white" }}>
        <Container maxWidth="lg">
          <Grid
            container
            spacing={3}
            justifyContent="center"
            textAlign="center"
          >
            <Grid item xs={6} sm={3}>
              <Typography variant="h3" component="div" fontWeight="bold">
                10,000+
              </Typography>
              <Typography variant="h6">Issues Resolved</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="h3" component="div" fontWeight="bold">
                5,000+
              </Typography>
              <Typography variant="h6">Active Users</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="h3" component="div" fontWeight="bold">
                50+
              </Typography>
              <Typography variant="h6">Cities Covered</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Typography variant="h3" component="div" fontWeight="bold">
                95%
              </Typography>
              <Typography variant="h6">Satisfaction Rate</Typography>
            </Grid>
          </Grid>
        </Container>
      </Paper>

      {/* Footer */}
      <Box component="footer" sx={{ bgcolor: "background.paper", py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            {"© "}
            {new Date().getFullYear()}
            {" Improve My City. All rights reserved."}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
