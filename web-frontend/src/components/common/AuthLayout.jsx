import { Box, Container, Stack, Typography } from "@mui/material";
import { ArrowLeft } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { gradients, palette } from "../../theme/tokens";
import { QuantumField, Wordmark } from "./Brand";

/**
 * Split-screen shell for the auth flow. The left rail carries the brand story
 * (and the quantum-field signature); the right side hosts the form. On small
 * screens the rail collapses and only the form remains.
 */
const points = [
  "Adaptive AI strategies that retrain on live data",
  "A risk engine that acts before you breach a limit",
  "One terminal for research, execution, and reporting",
];

const AuthLayout = ({ title, subtitle, children }) => (
  <Box sx={{ minHeight: "100vh", display: "flex", background: gradients.app }}>
    {/* Brand rail */}
    <Box
      sx={{
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        justifyContent: "space-between",
        width: "44%",
        p: 6,
        position: "relative",
        overflow: "hidden",
        borderRight: `1px solid ${palette.border}`,
      }}
    >
      <QuantumField opacity={0.45} />
      <Box sx={{ position: "relative" }}>
        <RouterLink to="/" style={{ textDecoration: "none" }}>
          <Wordmark size={34} />
        </RouterLink>
      </Box>
      <Box sx={{ position: "relative", maxWidth: 420 }}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Your edge,{" "}
          <Box
            component="span"
            sx={{
              background: gradients.brand,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            quantified
          </Box>
        </Typography>
        <Stack spacing={1.5}>
          {points.map((p) => (
            <Stack key={p} direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: palette.cyan,
                  flexShrink: 0,
                }}
              />
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {p}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Box>
      <Typography
        variant="caption"
        sx={{ position: "relative", color: "text.secondary" }}
      >
        © {new Date().getFullYear()} QuantumAlpha
      </Typography>
    </Box>

    {/* Form side */}
    <Box
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 3, md: 6 },
      }}
    >
      <Container maxWidth="xs" disableGutters>
        <Box sx={{ display: { md: "none" }, mb: 4 }}>
          <RouterLink to="/" style={{ textDecoration: "none" }}>
            <Wordmark size={30} />
          </RouterLink>
        </Box>
        <RouterLink to="/" style={{ textDecoration: "none" }}>
          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            sx={{ color: "text.secondary", mb: 3 }}
          >
            <ArrowLeft size={15} />
            <Typography variant="caption">Back to home</Typography>
          </Stack>
        </RouterLink>
        <Typography variant="h4" sx={{ mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ mb: 4 }}>
          {subtitle}
        </Typography>
        {children}
      </Container>
    </Box>
  </Box>
);

export default AuthLayout;
