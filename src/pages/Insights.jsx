import { useEffect, useRef } from "react";
import { useTransactions } from "../contexts/TransactionContext";
import {
  getMonthlyData, getCategoryBreakdown,
  formatCurrency,
} from "../utils/helpers";
import { CATEGORY_COLORS } from "../utils/mockData";
import Chart from "chart.js/auto";

/* ─── CHART HOOK ─── */
function useChart(id, buildConfig, deps) {
  const chartRef = useRef(null);
  useEffect(() => {
    const el = document.getElementById(id);
    if (!el) return;
    if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }
    chartRef.current = new Chart(el.getContext("2d"), buildConfig());
    return () => { if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; } };
  }, deps);
}

const ttStyle = {
  backgroundColor: "#0c0d1d",
  borderColor: "rgba(255,255,255,0.08)",
  borderWidth: 1,
  titleColor: "#fff",
  bodyColor: "rgba(255,255,255,0.65)",
  padding: 10,
  cornerRadius: 8,
};

const axisStyle = {
  grid: { color: "rgba(255,255,255,0.04)" },
  ticks: { color: "rgba(255,255,255,0.28)", font: { family: "'DM Mono'", size: 10 } },
};

/* ─── INSIGHTS PAGE ─── */
const Insights = () => {
  const { transactions } = useTransactions();
  const monthly = getMonthlyData(transactions);
  const breakdown = getCategoryBreakdown(transactions);
  const maxCat = breakdown[0]?.value || 1;

  // Income vs Expenses bar chart
  useChart(
    "insightsBarChart",
    () => ({
      type: "bar",
      data: {
        labels: monthly.map((d) => d.label),
        datasets: [
          { label: "Income",   data: monthly.map((d) => d.income),   backgroundColor: "rgba(34,197,94,0.65)",  borderRadius: 5, borderSkipped: false },
          { label: "Expenses", data: monthly.map((d) => d.expenses), backgroundColor: "rgba(239,68,68,0.6)",   borderRadius: 5, borderSkipped: false },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: "rgba(255,255,255,0.4)", font: { family: "'DM Mono'", size: 10 } } },
          tooltip: { ...ttStyle, callbacks: { label: (c) => ` ${c.dataset.label}: ${formatCurrency(c.raw)}` } },
        },
        scales: {
          x: { ...axisStyle },
          y: { ...axisStyle, ticks: { ...axisStyle.ticks, callback: (v) => `₹${(v / 1000).toFixed(0)}k` } },
        },
      },
    }),
    [transactions]
  );

  // Net balance line chart
  useChart(
    "netBalanceChart",
    () => {
      const ctx = document.getElementById("netBalanceChart").getContext("2d");
      const g = ctx.createLinearGradient(0, 0, 0, 200);
      g.addColorStop(0, "rgba(157,108,255,0.3)");
      g.addColorStop(1, "rgba(157,108,255,0)");
      return {
        type: "line",
        data: {
          labels: monthly.map((d) => d.label),
          datasets: [{
            label: "Net Balance",
            data: monthly.map((d) => d.balance),
            borderColor: "#9d6cff",
            backgroundColor: g,
            borderWidth: 2,
            tension: 0.4,
            pointBackgroundColor: "#9d6cff",
            pointRadius: 4,
            fill: true,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: "rgba(255,255,255,0.4)", font: { family: "'DM Mono'", size: 10 } } },
            tooltip: { ...ttStyle, callbacks: { label: (c) => ` Net: ${formatCurrency(c.raw)}` } },
          },
          scales: {
            x: { ...axisStyle },
            y: { ...axisStyle, ticks: { ...axisStyle.ticks, callback: (v) => `₹${(v / 1000).toFixed(0)}k` } },
          },
        },
      };
    },
    [transactions]
  );

  return (
    <div className="flex flex-col gap-6 fade-up">
      {/* Header */}
      <div>
        <p className="text-xs mb-1" style={{ fontFamily: "'DM Mono', monospace", color: "var(--accent)", letterSpacing: "0.15em" }}>
          03 — ANALYTICS
        </p>
        <h2 className="text-2xl font-bold" style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.03em" }}>
          Financial <span style={{ color: "var(--accent)" }}>Insights</span>
        </h2>
      </div>

      {/* Row 1: Bar chart + Category breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Income vs Expenses bar */}
        <div className="rounded-2xl p-5" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2 mb-4">
            <span style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "var(--accent)", display: "inline-block" }} />
            <span className="text-sm font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
              Income vs Expenses
            </span>
          </div>
          <div style={{ position: "relative", height: 220 }}>
            <canvas id="insightsBarChart" style={{ position: "absolute", inset: 0 }} />
          </div>
        </div>

        {/* Category breakdown */}
        <div className="rounded-2xl p-5" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2 mb-4">
            <span style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "#ff5c3a", display: "inline-block" }} />
            <span className="text-sm font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
              Category Breakdown
            </span>
          </div>
          <div className="flex flex-col gap-3 overflow-y-auto" style={{ maxHeight: 220 }}>
            {breakdown.map((d) => {
              const color = CATEGORY_COLORS[d.name] || "#9d6cff";
              const pct = ((d.value / maxCat) * 100).toFixed(1);
              return (
                <div key={d.name} className="flex items-center gap-3">
                  <span style={{ width: 9, height: 9, borderRadius: "50%", backgroundColor: color, flexShrink: 0, display: "inline-block" }} />
                  <span className="text-sm flex-1" style={{ color: "rgba(255,255,255,0.75)" }}>{d.name}</span>
                  <div style={{ width: 90, height: 3, backgroundColor: "rgba(255,255,255,0.07)", borderRadius: 100, overflow: "hidden", flexShrink: 0 }}>
                    <div style={{ height: "100%", width: `${pct}%`, backgroundColor: color, borderRadius: 100, transition: "width 1s ease" }} />
                  </div>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.38)", width: 72, textAlign: "right", flexShrink: 0 }}>
                    {formatCurrency(d.value)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 2: Net balance line */}
      <div className="rounded-2xl p-5" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2 mb-4">
          <span style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "#9d6cff", display: "inline-block" }} />
          <span className="text-sm font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
            Net Balance Over Time
          </span>
        </div>
        <div style={{ position: "relative", height: 200 }}>
          <canvas id="netBalanceChart" style={{ position: "absolute", inset: 0 }} />
        </div>
      </div>

      {/* Row 3: Monthly summary */}
      <div className="rounded-2xl p-5" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2 mb-4">
          <span style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "var(--accent2)", display: "inline-block" }} />
          <span className="text-sm font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
            Monthly Summary
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {[...monthly].reverse().map((m) => (
            <div
              key={m.month}
              className="flex items-center justify-between px-4 py-3 rounded-xl transition-all"
              style={{
                backgroundColor: "rgba(255,255,255,0.025)",
                border: "1px solid var(--border)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.025)")}
            >
              <span className="text-sm font-semibold text-white" style={{ minWidth: 72 }}>{m.label}</span>
              <div className="flex gap-6">
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-sm font-bold" style={{ fontFamily: "'Syne', sans-serif", color: "#22c55e" }}>{formatCurrency(m.income)}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.22)", letterSpacing: "0.06em" }}>INCOME</span>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-sm font-bold" style={{ fontFamily: "'Syne', sans-serif", color: "#ef4444" }}>{formatCurrency(m.expenses)}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.22)", letterSpacing: "0.06em" }}>EXPENSES</span>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-sm font-bold" style={{ fontFamily: "'Syne', sans-serif", color: m.balance >= 0 ? "#9d6cff" : "#ff5c3a" }}>
                    {m.balance >= 0 ? "+" : ""}{formatCurrency(m.balance)}
                  </span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.22)", letterSpacing: "0.06em" }}>NET</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Insights;
