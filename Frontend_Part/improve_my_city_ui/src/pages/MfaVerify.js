import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

const MfaVerify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(120); // 2 minutes
  const [canResend, setCanResend] = useState(false);

  const { email, user } = location.state || {};

  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          setCanResend(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await authService.verifyEmailOtp({
        email,
        otpCode: otp,
      });

      if (result.success) {
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        navigate("/dashboard");
      } else {
        setError(result.message || "OTP verification failed");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "OTP verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await authService.sendEmailMfaOtp(email);
      setTimer(120);
      setCanResend(false);
      setError("");
    } catch (error) {
      setError("Failed to resend OTP. Please try again.");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (!email) {
    return null;
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: "100%" }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Verify Your Login
          </Typography>

          <Typography variant="body1" align="center" sx={{ mb: 3 }}>
            An OTP has been sent to your registered email address ({email}).
            Please enter it below.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleVerify}>
            <TextField
              fullWidth
              label="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              margin="normal"
              inputProps={{ maxLength: 6 }}
              required
            />

            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ mt: 1, mb: 2 }}
            >
              OTP expires in: {formatTime(timer)}
            </Typography>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 2 }}
              disabled={loading || otp.length !== 6}
            >
              {loading ? <CircularProgress size={24} /> : "Verify OTP"}
            </Button>

            <Box textAlign="center">
              <Button
                onClick={handleResendOtp}
                disabled={!canResend}
                color="primary"
              >
                Resend OTP
              </Button>
            </Box>

            <Box textAlign="center" sx={{ mt: 2 }}>
              <Button onClick={() => navigate("/login")} color="secondary">
                Back to Login
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default MfaVerify;
