import { Box, Typography } from "@mui/material";
import { gradients, palette } from "../../theme/tokens";

/**
 * The QuantumAlpha logomark: a hexagonal "Q" lattice node with an alpha glyph.
 * Kept as inline SVG so it scales crisply and inherits the brand gradient.
 */
export const Logo = ({ size = 34 }) => (
  <Box sx={{ display: "inline-flex", lineHeight: 0 }}>
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      <defs>
        <linearGradient id="qa-brand" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor={palette.cyan} />
          <stop offset="100%" stopColor={palette.violet} />
        </linearGradient>
      </defs>
      <path
        d="M24 3 41.2 13v22L24 45 6.8 35V13L24 3Z"
        stroke="url(#qa-brand)"
        strokeWidth="2.4"
        fill="rgba(34,211,238,0.05)"
      />
      <circle cx="24" cy="24" r="3.4" fill="url(#qa-brand)" />
      <path
        d="M24 24 L33 33"
        stroke="url(#qa-brand)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="24" cy="11" r="1.7" fill={palette.cyan} />
      <circle cx="36" cy="30" r="1.7" fill={palette.violet} />
      <circle cx="12" cy="30" r="1.7" fill={palette.cyan} />
    </svg>
  </Box>
);

export const Wordmark = ({ size = 34, showText = true, sx }) => (
  <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1.2, ...sx }}>
    <Logo size={size} />
    {showText && (
      <Typography
        sx={{
          fontWeight: 800,
          fontSize: size * 0.55,
          letterSpacing: "-0.02em",
          background: gradients.brand,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        QuantumAlpha
      </Typography>
    )}
  </Box>
);

/**
 * Signature element: an animated lattice of nodes connected by faint lines that
 * drifts behind the hero - a visual stand-in for a quantum field / order book
 * graph. Pure SVG + CSS so it is light and respects reduced-motion.
 */
export const QuantumField = ({ opacity = 0.5 }) => {
  const nodes = [
    [8, 18],
    [22, 10],
    [38, 24],
    [54, 12],
    [70, 26],
    [86, 16],
    [14, 44],
    [30, 36],
    [46, 50],
    [62, 40],
    [78, 52],
    [92, 42],
    [6, 70],
    [24, 64],
    [40, 78],
    [58, 68],
    [74, 80],
    [90, 70],
  ];
  const links = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [0, 6],
    [1, 7],
    [2, 9],
    [4, 10],
    [5, 11],
    [6, 7],
    [7, 8],
    [8, 9],
    [9, 10],
    [10, 11],
    [6, 12],
    [7, 13],
    [8, 14],
    [9, 15],
    [10, 16],
    [11, 17],
    [12, 13],
    [13, 14],
    [14, 15],
    [15, 16],
    [16, 17],
  ];
  return (
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        inset: 0,
        opacity,
        pointerEvents: "none",
        "@keyframes qa-pulse": {
          "0%,100%": { opacity: 0.3, r: 0.7 },
          "50%": { opacity: 1, r: 1.4 },
        },
        "@media (prefers-reduced-motion: reduce)": {
          "& circle": { animation: "none !important" },
        },
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 90"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="qa-line" x1="0" y1="0" x2="100" y2="90">
            <stop offset="0%" stopColor={palette.cyan} stopOpacity="0.55" />
            <stop offset="100%" stopColor={palette.violet} stopOpacity="0.45" />
          </linearGradient>
        </defs>
        {links.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a][0]}
            y1={nodes[a][1]}
            x2={nodes[b][0]}
            y2={nodes[b][1]}
            stroke="url(#qa-line)"
            strokeWidth="0.18"
          />
        ))}
        {nodes.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="1"
            fill={i % 2 ? palette.violet : palette.cyan}
            style={{
              animation: `qa-pulse ${3 + (i % 5) * 0.6}s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </svg>
    </Box>
  );
};

export default Wordmark;
