import React from "react";
import { Breadcrumbs, Link, Typography, Box } from "@mui/material";
import { Home, NavigateNext } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";

const CustomBreadcrumbs = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const pathnames = location.pathname.split("/").filter((x) => x);

  // Don't show breadcrumbs on these pages
  if (["/", "/login", "/register", "/dashboard"].includes(location.pathname)) {
    return null;
  }

  const formatBreadcrumbName = (name) => {
    const nameMap = {
      complaints: "Complaints",
      new: "New Complaint",
      analytics: "Analytics",
      profile: "My Profile",
      users: "User Management",
      audit: "Audit Logs",
      dashboard: "Dashboard",
    };

    return nameMap[name] || name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <Box sx={{ mb: 3, mt: 2, px: 2 }}>
      <Breadcrumbs
        separator={<NavigateNext fontSize="small" />}
        aria-label="breadcrumb"
      >
        <Link
          component="button"
          onClick={() => navigate("/dashboard")}
          sx={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            color: "primary.main",
            fontWeight: 500,
            "&:hover": {
              textDecoration: "underline",
              color: "primary.dark",
            },
          }}
        >
          <Home sx={{ mr: 0.5 }} fontSize="small" />
          Dashboard
        </Link>

        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          const formattedName = formatBreadcrumbName(name);

          return isLast ? (
            <Typography
              key={name}
              color="text.primary"
              fontWeight="600"
              variant="body1"
            >
              {formattedName}
            </Typography>
          ) : (
            <Link
              key={name}
              component="button"
              onClick={() => navigate(routeTo)}
              sx={{
                textDecoration: "none",
                color: "primary.main",
                fontWeight: 500,
                "&:hover": {
                  textDecoration: "underline",
                  color: "primary.dark",
                },
              }}
            >
              {formattedName}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default CustomBreadcrumbs;
