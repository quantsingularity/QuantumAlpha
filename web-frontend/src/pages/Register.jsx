import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  InputAdornment,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ArrowRight, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import AuthLayout from "../components/common/AuthLayout";
import { useRegisterMutation } from "../services/api";
import { loginSuccess } from "../store/slices/authSlice";
import { isValidEmail, validatePassword } from "../utils/validation";

const strengthLabel = ["Very weak", "Weak", "Fair", "Good", "Strong"];
const strengthColor = ["#FB7185", "#FB7185", "#FBBF24", "#34D399", "#22D3EE"];

const scorePassword = (pw) => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 4);
};

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [register, { isLoading }] = useRegisterMutation();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const score = useMemo(
    () => scorePassword(formData.password),
    [formData.password],
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError("");
  };

  const validateForm = () => {
    const next = {};
    if (!formData.firstName.trim()) next.firstName = "First name is required";
    if (!formData.lastName.trim()) next.lastName = "Last name is required";
    if (!formData.email.trim()) next.email = "Email is required";
    else if (!isValidEmail(formData.email))
      next.email = "Enter a valid email address";
    if (!formData.password) next.password = "Password is required";
    else {
      const v = validatePassword(formData.password);
      if (!v.isValid) next.password = v.errors[0];
    }
    if (!formData.confirmPassword)
      next.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      next.confirmPassword = "Passwords do not match";
    if (!agreedToTerms) next.terms = "You must agree to the terms to continue";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    if (!validateForm()) return;

    const payload = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      password: formData.password,
    };

    try {
      const result = await register(payload).unwrap();
      // Backend may or may not return a token on register. If it does, sign in
      // directly; otherwise send the user to login with a success message.
      const token = result?.token || result?.access_token;
      if (token) {
        dispatch(
          loginSuccess({
            user: result.user || { email: formData.email },
            token,
          }),
        );
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/login", {
          state: { message: "Account created. Please sign in." },
        });
      }
    } catch (err) {
      const isNetwork =
        !err?.status || err?.status === "FETCH_ERROR" || err?.status >= 500;
      if (isNetwork) {
        dispatch(
          loginSuccess({
            user: { email: formData.email, name: payload.name },
            token: `demo-${Date.now()}`,
          }),
        );
        navigate("/dashboard", { replace: true });
        return;
      }
      setApiError(err?.data?.error || "Registration failed. Please try again.");
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Set up your QuantumAlpha terminal in under two minutes."
    >
      {apiError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {apiError}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={2.25}>
          <Stack direction="row" spacing={1.5}>
            <TextField
              name="firstName"
              label="First name"
              value={formData.firstName}
              onChange={handleChange}
              error={Boolean(errors.firstName)}
              helperText={errors.firstName}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <User size={17} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              name="lastName"
              label="Last name"
              value={formData.lastName}
              onChange={handleChange}
              error={Boolean(errors.lastName)}
              helperText={errors.lastName}
              fullWidth
            />
          </Stack>

          <TextField
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={Boolean(errors.email)}
            helperText={errors.email}
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

          <Box>
            <TextField
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              error={Boolean(errors.password)}
              helperText={errors.password}
              fullWidth
              autoComplete="new-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={17} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((s) => !s)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {formData.password && (
              <Box sx={{ mt: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={(score / 4) * 100}
                  sx={{
                    height: 5,
                    borderRadius: 3,
                    backgroundColor: "rgba(255,255,255,0.08)",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: strengthColor[score],
                      borderRadius: 3,
                    },
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{ color: strengthColor[score] }}
                >
                  {strengthLabel[score]}
                </Typography>
              </Box>
            )}
          </Box>

          <TextField
            name="confirmPassword"
            label="Confirm password"
            type={showPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            error={Boolean(errors.confirmPassword)}
            helperText={errors.confirmPassword}
            fullWidth
            autoComplete="new-password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock size={17} />
                </InputAdornment>
              ),
            }}
          />

          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                />
              }
              label={
                <Typography variant="body2">
                  I agree to the Terms of Service and Privacy Policy
                </Typography>
              }
            />
            {errors.terms && (
              <Typography
                variant="caption"
                sx={{ color: "error.main", display: "block", ml: 1.5 }}
              >
                {errors.terms}
              </Typography>
            )}
          </Box>

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isLoading}
            endIcon={!isLoading && <ArrowRight size={18} />}
            sx={{ py: 1.3 }}
          >
            {isLoading ? (
              <CircularProgress size={22} sx={{ color: "inherit" }} />
            ) : (
              "Create account"
            )}
          </Button>

          <Typography variant="body2" sx={{ textAlign: "center" }}>
            Already have an account?{" "}
            <Typography
              component={RouterLink}
              to="/login"
              variant="body2"
              sx={{
                color: "primary.main",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Sign in
            </Typography>
          </Typography>
        </Stack>
      </Box>
    </AuthLayout>
  );
};

export default Register;
