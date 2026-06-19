/**
 * QuantumAlpha - unified design tokens ("Quantum Terminal")
 *
 * Single source of truth for the visual identity shared across the web and
 * mobile clients. The mobile client mirrors these values in its ThemeContext
 * so both surfaces read as one product.
 */

export const palette = {
  // Backgrounds - deep space navy, layered
  void: "#060A14",
  abyss: "#0A1020",
  surface: "#0F1626",
  surfaceRaised: "#15203A",
  surfaceGlass: "rgba(20, 30, 54, 0.6)",

  // Hairline borders / dividers
  border: "rgba(148, 163, 184, 0.14)",
  borderStrong: "rgba(148, 163, 184, 0.28)",

  // Accents - the "quantum" dual signal
  cyan: "#22D3EE",
  cyanDim: "#0E7490",
  violet: "#8B5CF6",
  violetDim: "#6D28D9",

  // Semantic - market direction
  mint: "#34D399", // gains
  rose: "#FB7185", // losses
  amber: "#FBBF24", // neutral / warning

  // Text
  text: "#F1F5F9",
  textDim: "#94A3B8",
  textMute: "#5B6B85",

  white: "#FFFFFF",
  black: "#000000",
};

export const gradients = {
  // Primary brand gradient (cyan -> violet)
  brand: `linear-gradient(135deg, ${palette.cyan} 0%, ${palette.violet} 100%)`,
  brandSoft: `linear-gradient(135deg, ${palette.cyan}22 0%, ${palette.violet}22 100%)`,
  // App background
  app: `radial-gradient(1200px 600px at 80% -10%, ${palette.violet}1a, transparent 60%), radial-gradient(1000px 500px at -10% 10%, ${palette.cyan}14, transparent 55%), linear-gradient(180deg, ${palette.abyss} 0%, ${palette.void} 100%)`,
  gain: "linear-gradient(135deg, #34D399 0%, #10B981 100%)",
  loss: "linear-gradient(135deg, #FB7185 0%, #E11D48 100%)",
};

export const fonts = {
  // Geometric UI sans
  sans: '"Inter", "Segoe UI", system-ui, -apple-system, sans-serif',
  // Terminal numerics - the signature
  mono: '"JetBrains Mono", "SFMono-Regular", "Roboto Mono", ui-monospace, monospace',
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  pill: 999,
};

export const shadow = {
  card: "0 1px 0 rgba(255,255,255,0.04) inset, 0 18px 40px -24px rgba(0,0,0,0.8)",
  glow: `0 0 0 1px ${palette.cyan}33, 0 12px 40px -12px ${palette.cyan}55`,
  glowViolet: `0 0 0 1px ${palette.violet}33, 0 12px 40px -12px ${palette.violet}55`,
};

export default { palette, gradients, fonts, radii, shadow };
