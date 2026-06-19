import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  Skeleton,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  DollarSign,
  Minus,
  Plus,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ErrorBoundary from "../components/common/ErrorBoundary";
import {
  useGetPortfolioHistoryQuery,
  useGetPortfolioQuery,
  useGetStrategiesQuery,
  useGetTradesQuery,
} from "../services/api";
import { palette } from "../theme/tokens";
import {
  formatCompactNumber,
  formatCurrency,
  formatRelativeTime,
} from "../utils/format";

const MONO = '"JetBrains Mono", monospace';

// ── Normalisers ──────────────────────────────────────────────────────────
// The backend returns rich objects (total_value, return_ytd, side, ...). These
// helpers reduce any shape - backend, partial, or missing - to exactly what the
// UI renders, and guarantee arrays stay arrays so .map can never crash.
const normalizePortfolio = (p) => {
  const d = p || {};
  return {
    value: d.total_value ?? d.portfolioValue ?? 0,
    dailyChange: d.daily_change ?? d.dailyChange ?? 0,
    percentChange: d.daily_change_percent ?? d.percentChange ?? 0,
    cash: d.cash_balance ?? 0,
    invested: d.invested_amount ?? 0,
    positions: Array.isArray(d.positions) ? d.positions : [],
  };
};

const normalizeStrategies = (s) => {
  const list = Array.isArray(s)
    ? s
    : Array.isArray(s?.strategies)
      ? s.strategies
      : [];
  return list.map((x, i) => ({
    id: x.id ?? x.name ?? i,
    name: x.name ?? "Untitled strategy",
    status: x.status ?? "active",
    ret: x.return_ytd ?? x.return ?? 0,
    sharpe: x.sharpe_ratio ?? x.sharpe ?? null,
    type: x.type ?? "custom",
  }));
};

const normalizeTrades = (t) => {
  const list = Array.isArray(t) ? t : Array.isArray(t?.trades) ? t.trades : [];
  return list.map((x, i) => ({
    id: x.id ?? i,
    symbol: x.symbol ?? "-",
    side: (x.side ?? x.type ?? "buy").toString().toUpperCase(),
    amount:
      x.total_value ??
      (x.quantity && x.price ? x.quantity * x.price : (x.amount ?? 0)),
    price: x.price ?? 0,
    time: x.timestamp ?? x.time ?? null,
  }));
};

const normalizeHistory = (h) => {
  const list = Array.isArray(h)
    ? h
    : Array.isArray(h?.historicalData)
      ? h.historicalData
      : [];
  return list.map((x) => ({
    date: x.date ?? x.name ?? "",
    value: x.value ?? 0,
  }));
};

// ── Small presentational pieces ─────────────────────────────────────────
const StatCard = ({ title, value, change, icon: Icon, accent }) => {
  const positive = (change ?? 0) >= 0;
  return (
    <Box
      sx={{
        height: "100%",
        p: 2.5,
        borderRadius: 3,
        border: `1px solid ${palette.border}`,
        background: palette.surface,
        position: "relative",
        overflow: "hidden",
        transition: "border-color .2s ease, transform .2s ease",
        "&:hover": {
          borderColor: `${accent}55`,
          transform: "translateY(-3px)",
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          insetInline: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1.5 }}
      >
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {title}
        </Typography>
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: 2,
            display: "grid",
            placeItems: "center",
            color: accent,
            background: `${accent}14`,
          }}
        >
          <Icon size={18} />
        </Box>
      </Stack>
      <Typography
        sx={{ fontFamily: MONO, fontWeight: 700, fontSize: "1.6rem", mb: 0.5 }}
      >
        {value}
      </Typography>
      {change !== null && change !== undefined && (
        <Stack direction="row" spacing={0.5} alignItems="center">
          {positive ? (
            <ArrowUpRight size={15} color={palette.mint} />
          ) : (
            <ArrowDownRight size={15} color={palette.rose} />
          )}
          <Typography
            sx={{
              fontFamily: MONO,
              fontSize: "0.82rem",
              fontWeight: 700,
              color: positive ? palette.mint : palette.rose,
            }}
          >
            {positive ? "+" : ""}
            {Number(change).toFixed(2)}%
          </Typography>
        </Stack>
      )}
    </Box>
  );
};

const Panel = ({ title, action, children, sx }) => (
  <Box
    sx={{
      p: 3,
      borderRadius: 4,
      border: `1px solid ${palette.border}`,
      background: palette.surface,
      height: "100%",
      ...sx,
    }}
  >
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ mb: 2.5 }}
    >
      <Typography variant="h6">{title}</Typography>
      {action}
    </Stack>
    {children}
  </Box>
);

const Dashboard = () => {
  const [range, setRange] = useState("1M");
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");

  const { data: portfolioRaw, isLoading: pLoading } = useGetPortfolioQuery();
  const { data: strategiesRaw, isLoading: sLoading } = useGetStrategiesQuery();
  const { data: tradesRaw } = useGetTradesQuery({ limit: 6 });
  const { data: historyRaw } = useGetPortfolioHistoryQuery(range);

  const portfolio = useMemo(
    () => normalizePortfolio(portfolioRaw),
    [portfolioRaw],
  );
  const strategies = useMemo(
    () => normalizeStrategies(strategiesRaw),
    [strategiesRaw],
  );
  const trades = useMemo(() => normalizeTrades(tradesRaw), [tradesRaw]);
  const history = useMemo(() => normalizeHistory(historyRaw), [historyRaw]);

  const activeCount = strategies.filter((s) => s.status === "active").length;
  const winRate = useMemo(() => {
    if (!strategies.length) return null;
    const wins = strategies.filter((s) => s.ret > 0).length;
    return ((wins / strategies.length) * 100).toFixed(1);
  }, [strategies]);

  const closeModals = () => {
    setDepositOpen(false);
    setWithdrawOpen(false);
    setAmount("");
    setMsg("");
  };

  const submitTxn = (type) => {
    const val = parseFloat(amount);
    if (!amount || val <= 0) return;
    setMsg(
      `${formatCurrency(val)} ${type === "deposit" ? "deposited" : "withdrawal initiated"}`,
    );
    setTimeout(closeModals, 1800);
  };

  return (
    <ErrorBoundary>
      <Box>
        {/* Header */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ sm: "center" }}
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: 4 }}
        >
          <Box>
            <Typography variant="h4">Dashboard</Typography>
            <Typography variant="body2">
              Your portfolio at a glance, updated in real time.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              startIcon={<Minus size={17} />}
              onClick={() => setWithdrawOpen(true)}
            >
              Withdraw
            </Button>
            <Button
              variant="contained"
              startIcon={<Plus size={17} />}
              onClick={() => setDepositOpen(true)}
            >
              Add funds
            </Button>
          </Stack>
        </Stack>

        {/* Stats */}
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            {pLoading ? (
              <Skeleton variant="rounded" height={132} />
            ) : (
              <StatCard
                title="Portfolio value"
                value={formatCurrency(portfolio.value)}
                change={portfolio.percentChange}
                icon={DollarSign}
                accent={palette.cyan}
              />
            )}
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            {pLoading ? (
              <Skeleton variant="rounded" height={132} />
            ) : (
              <StatCard
                title="Daily P&L"
                value={`$${formatCompactNumber(portfolio.dailyChange)}`}
                change={portfolio.percentChange}
                icon={TrendingUp}
                accent={palette.mint}
              />
            )}
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Active strategies"
              value={activeCount || strategies.length}
              change={null}
              icon={Activity}
              accent={palette.violet}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Win rate"
              value={winRate ? `${winRate}%` : "-"}
              change={null}
              icon={BarChart3}
              accent={palette.amber}
            />
          </Grid>
        </Grid>

        {/* Performance chart */}
        <Panel
          title="Portfolio performance"
          action={
            <ToggleButtonGroup
              size="small"
              exclusive
              value={range}
              onChange={(_e, v) => v && setRange(v)}
              sx={{
                "& .MuiToggleButton-root": {
                  px: 1.5,
                  py: 0.4,
                  fontFamily: MONO,
                  fontSize: "0.72rem",
                  border: `1px solid ${palette.border}`,
                  color: "text.secondary",
                  "&.Mui-selected": {
                    color: palette.void,
                    background: palette.cyan,
                    "&:hover": { background: palette.cyan },
                  },
                },
              }}
            >
              {["1W", "1M", "3M", "1Y"].map((r) => (
                <ToggleButton key={r} value={r}>
                  {r}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          }
          sx={{ mb: 3 }}
        >
          <Box sx={{ height: 320 }}>
            {history.length === 0 ? (
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{ height: "100%", color: "text.secondary" }}
              >
                <CircularProgress size={26} sx={{ mb: 1.5 }} />
                <Typography variant="body2">
                  Loading performance data…
                </Typography>
              </Stack>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={history}
                  margin={{ left: 4, right: 8, top: 8 }}
                >
                  <defs>
                    <linearGradient id="qaArea" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor={palette.cyan}
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="100%"
                        stopColor={palette.cyan}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(148,163,184,0.1)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    stroke={palette.textMute}
                    fontSize={11}
                    tickLine={false}
                    minTickGap={32}
                  />
                  <YAxis
                    stroke={palette.textMute}
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `$${formatCompactNumber(v)}`}
                    width={60}
                  />
                  <Tooltip
                    contentStyle={{
                      background: palette.surfaceRaised,
                      border: `1px solid ${palette.border}`,
                      borderRadius: 10,
                      color: palette.text,
                      fontFamily: MONO,
                      fontSize: 12,
                    }}
                    formatter={(v) => [formatCurrency(v), "Value"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={palette.cyan}
                    strokeWidth={2.5}
                    fill="url(#qaArea)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </Box>
        </Panel>

        {/* Strategies + Trades */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={7}>
            <Panel title="Strategy performance">
              {sLoading ? (
                <Stack spacing={1.5}>
                  {[0, 1, 2].map((i) => (
                    <Skeleton key={i} variant="rounded" height={64} />
                  ))}
                </Stack>
              ) : strategies.length === 0 ? (
                <Typography variant="body2">
                  No strategies yet. Create one to get started.
                </Typography>
              ) : (
                <Stack spacing={1.25}>
                  {strategies.map((s) => {
                    const up = s.ret >= 0;
                    return (
                      <Stack
                        key={s.id}
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{
                          p: 2,
                          borderRadius: 2.5,
                          border: `1px solid ${palette.border}`,
                          transition: "background .2s ease, transform .2s ease",
                          "&:hover": {
                            background: palette.surfaceRaised,
                            transform: "translateX(4px)",
                          },
                        }}
                      >
                        <Box>
                          <Typography sx={{ fontWeight: 600 }}>
                            {s.name}
                          </Typography>
                          <Stack direction="row" spacing={1} sx={{ mt: 0.75 }}>
                            <Chip
                              label={s.status}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: "0.68rem",
                                color:
                                  s.status === "active"
                                    ? palette.mint
                                    : palette.textDim,
                                background:
                                  s.status === "active"
                                    ? "rgba(52,211,153,0.12)"
                                    : "rgba(148,163,184,0.1)",
                              }}
                            />
                            {s.sharpe != null && (
                              <Typography
                                variant="caption"
                                sx={{
                                  fontFamily: MONO,
                                  color: "text.secondary",
                                }}
                              >
                                Sharpe {Number(s.sharpe).toFixed(2)}
                              </Typography>
                            )}
                          </Stack>
                        </Box>
                        <Typography
                          sx={{
                            fontFamily: MONO,
                            fontWeight: 700,
                            fontSize: "1.05rem",
                            color: up ? palette.mint : palette.rose,
                          }}
                        >
                          {up ? "+" : ""}
                          {Number(s.ret).toFixed(1)}%
                        </Typography>
                      </Stack>
                    );
                  })}
                </Stack>
              )}
            </Panel>
          </Grid>

          <Grid item xs={12} lg={5}>
            <Panel title="Recent trades">
              {trades.length === 0 ? (
                <Typography variant="body2">No recent trades.</Typography>
              ) : (
                <Stack spacing={1.25}>
                  {trades.map((t) => {
                    const buy = t.side === "BUY";
                    return (
                      <Stack
                        key={t.id}
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{
                          p: 1.75,
                          borderRadius: 2.5,
                          border: `1px solid ${palette.border}`,
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                        >
                          <Box
                            sx={{
                              width: 34,
                              height: 34,
                              borderRadius: 2,
                              display: "grid",
                              placeItems: "center",
                              color: buy ? palette.mint : palette.rose,
                              background: buy
                                ? "rgba(52,211,153,0.12)"
                                : "rgba(251,113,133,0.12)",
                            }}
                          >
                            {buy ? (
                              <ArrowUpRight size={16} />
                            ) : (
                              <ArrowDownRight size={16} />
                            )}
                          </Box>
                          <Box>
                            <Typography
                              sx={{ fontWeight: 600, fontSize: "0.9rem" }}
                            >
                              {t.symbol}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: "text.secondary" }}
                            >
                              {t.time ? formatRelativeTime(t.time) : t.side}
                            </Typography>
                          </Box>
                        </Stack>
                        <Box sx={{ textAlign: "right" }}>
                          <Typography
                            sx={{
                              fontFamily: MONO,
                              fontWeight: 700,
                              fontSize: "0.9rem",
                            }}
                          >
                            ${formatCompactNumber(t.amount)}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: MONO,
                              color: buy ? palette.mint : palette.rose,
                            }}
                          >
                            {t.side}
                          </Typography>
                        </Box>
                      </Stack>
                    );
                  })}
                </Stack>
              )}
            </Panel>
          </Grid>
        </Grid>
      </Box>

      {/* Deposit / Withdraw */}
      <Dialog
        open={depositOpen || withdrawOpen}
        onClose={closeModals}
        PaperProps={{ sx: { borderRadius: 3, minWidth: 380 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          {depositOpen ? "Add funds" : "Withdraw funds"}
        </DialogTitle>
        <DialogContent>
          {msg ? (
            <Typography
              sx={{
                py: 2,
                textAlign: "center",
                color: palette.mint,
                fontWeight: 700,
              }}
            >
              {msg}
            </Typography>
          ) : (
            <>
              <Typography variant="body2" sx={{ mb: 2.5 }}>
                {depositOpen
                  ? "Enter the amount to deposit into your trading account."
                  : "Withdrawals typically arrive within 1-3 business days."}
              </Typography>
              <TextField
                fullWidth
                label="Amount (USD)"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DollarSign size={16} />
                    </InputAdornment>
                  ),
                }}
              />
              <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                {[100, 500, 1000, 5000].map((a) => (
                  <Button
                    key={a}
                    size="small"
                    variant="outlined"
                    onClick={() => setAmount(String(a))}
                  >
                    ${a >= 1000 ? `${a / 1000}k` : a}
                  </Button>
                ))}
              </Stack>
            </>
          )}
        </DialogContent>
        {!msg && (
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={closeModals} sx={{ color: "text.secondary" }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => submitTxn(depositOpen ? "deposit" : "withdraw")}
            >
              {depositOpen ? "Deposit" : "Withdraw"}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </ErrorBoundary>
  );
};

export default Dashboard;
