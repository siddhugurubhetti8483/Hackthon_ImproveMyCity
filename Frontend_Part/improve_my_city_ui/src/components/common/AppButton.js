import React from "react";
import { Button, CircularProgress, Box } from "@mui/material";

const AppButton = ({
  children,
  loading = false,
  variant = "contained",
  color = "primary",
  size = "medium",
  startIcon,
  endIcon,
  disabled = false,
  onClick,
  type = "button",
  fullWidth = false,
  sx = {},
  ...props
}) => {
  const getButtonHeight = () => {
    switch (size) {
      case "small":
        return 32;
      case "large":
        return 48;
      default:
        return 40;
    }
  };

  const getPadding = () => {
    switch (size) {
      case "small":
        return "0 16px";
      case "large":
        return "0 24px";
      default:
        return "0 20px";
    }
  };

  return (
    <Button
      variant={variant}
      color={color}
      size={size}
      disabled={disabled || loading}
      startIcon={loading ? null : startIcon}
      endIcon={loading ? null : endIcon}
      onClick={onClick}
      type={type}
      fullWidth={fullWidth}
      sx={{
        position: "relative",
        minWidth: size === "small" ? 80 : size === "medium" ? 100 : 120,
        height: getButtonHeight(),
        padding: getPadding(),
        fontWeight: 600,
        textTransform: "none",
        borderRadius: 2,
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: disabled ? "none" : "translateY(-1px)",
          boxShadow: disabled ? "none" : 2,
        },
        "&:active": {
          transform: "translateY(0)",
        },
        ...sx,
      }}
      {...props}
    >
      {loading && (
        <CircularProgress
          size={20}
          sx={{
            position: "absolute",
            left: "50%",
            marginLeft: "-10px",
            color: "inherit",
          }}
        />
      )}
      <Box
        sx={{
          opacity: loading ? 0 : 1,
          display: "flex",
          alignItems: "center",
          gap: 0.5,
        }}
      >
        {children}
      </Box>
    </Button>
  );
};

export default AppButton;
