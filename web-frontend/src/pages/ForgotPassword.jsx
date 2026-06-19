import {
  Alert,
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ArrowLeft, CheckCircle2, Mail } from "lucide-react";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import AuthLayout from "../components/common/AuthLayout";
import { isValidEmail } from "../utils/validation";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return setError("Email is required");
    if (!isValidEmail(email)) return setError("Enter a valid email address");
    setError("");
    setLoading(true);
    // No public reset endpoint yet - acknowledge the request without leaking
    // whether the address exists, which is the safe default.
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <AuthLayout
        title="Check your inbox"
        subtitle="If an account exists for that email, a reset link is on its way."
      >
        <Box sx={{ textAlign: "center", py: 2 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              mx: "auto",
              mb: 2,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              color: "success.main",
              background: "rgba(52,211,153,0.12)",
            }}
          >
            <CheckCircle2 size={28} />
          </Box>
          <Typography variant="body2" sx={{ mb: 3 }}>
            We sent reset instructions to <strong>{email}</strong>. The link
            expires in 30 minutes.
          </Typography>
          <Button
            component={RouterLink}
            to="/login"
            variant="contained"
            fullWidth
          >
            Back to sign in
          </Button>
        </Box>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email and we'll send you a link to get back in."
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={2.5}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            fullWidth
            autoComplete="email"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Mail size={17} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ py: 1.3 }}
          >
            {loading ? (
              <CircularProgress size={22} sx={{ color: "inherit" }} />
            ) : (
              "Send reset link"
            )}
          </Button>
          <Button
            component={RouterLink}
            to="/login"
            startIcon={<ArrowLeft size={16} />}
            sx={{ color: "text.secondary" }}
          >
            Back to sign in
          </Button>
        </Stack>
      </Box>
    </AuthLayout>
  );
};

export default ForgotPassword;
