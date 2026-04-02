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

const Insights = () => {
  const { transactions } = useTransactions();
  const monthly = getMonthlyData(transactions);
  const breakdown = getCategoryBreakdown(transactions);
  const maxCat = breakdown[0]?.value || 1;

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

  return (
    <div className="flex flex-col gap-6 fade-in">
      <div>
        <div className="font-mono-dm text-[0.65rem] tracking-[0.15em] uppercase text-accent mb-[0.4rem] font-medium">03 — Analytics</div>
        <div className="font-syne text-[1.5rem] font-[800] tracking-[-0.03em] leading-none">Financial <span className="text-accent">Insights</span></div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-4">
        <div className="p-5 rounded-2xl bg-card border border-border-custom shadow-sm">
          <div className="font-syne text-[0.9rem] font-bold mb-4 flex items-center gap-2 text-white">
            <span className="w-[7px] h-[7px] rounded-full bg-accent" />
            Income vs Expenses
          </div>
          <div className="relative h-[200px]">
            <canvas id="insightsBarChart"></canvas>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border-custom shadow-sm">
          <div className="font-syne text-[1rem] font-bold mb-4 flex items-center gap-2 text-white">
            <span className="w-[8px] h-[8px] rounded-full bg-extracoral" />
            Category Breakdown
          </div>
          <div className="flex flex-col gap-2.5">
            {breakdown.map((d) => {
              const color = CATEGORY_COLORS[d.name] || "#9d6cff";
              return (
                <div key={d.name} className="flex items-center gap-3 group">
                  <span className="w-[9px] h-[9px] rounded-full shrink-0 group-hover:scale-125 transition-transform" style={{ background: color }}></span>
                  <span className="text-[0.88rem] flex-1 text-white/80 font-medium">{d.name}</span>
                  <div className="w-[100px] h-[4px] bg-white/10 rounded-full overflow-hidden shrink-0">
                    <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${(d.value / maxCat * 100).toFixed(1)}%`, background: color }}></div>
                  </div>
                  <span className="font-mono-dm text-[0.72rem] text-white/38 w-[80px] text-right font-medium">{formatCurrency(d.value)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-card border border-border-custom shadow-sm">
        <div className="font-syne text-[1rem] font-bold mb-4 flex items-center gap-2 text-white">
          <span className="w-[8px] h-[8px] rounded-full bg-accent2" />
          Monthly Summary
        </div>
        <div className="flex flex-col gap-2">
          {[...monthly].reverse().map((m) => (
            <div key={m.month} className="flex items-center justify-between p-3.5 px-5 rounded-xl bg-white/[0.025] border border-border-custom transition-all hover:bg-white/[0.05] cursor-none group">
              <span className="text-[0.9rem] font-[600] group-hover:text-accent transition-colors">{m.label}</span>
              <div className="flex gap-5">
                <div className="flex flex-col items-end gap-1">
                  <span className="font-syne text-[0.9rem] font-[700] text-[#22c55e]">{formatCurrency(m.income)}</span>
                  <span className="font-mono-dm text-[0.6rem] text-white/22 tracking-[0.06em] font-medium text-right">INCOME</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="font-syne text-[0.9rem] font-[700] text-[#ef4444]">{formatCurrency(m.expenses)}</span>
                  <span className="font-mono-dm text-[0.6rem] text-white/22 tracking-[0.06em] font-medium text-right">EXPENSES</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`font-syne text-[0.9rem] font-[700] ${m.balance >= 0 ? 'text-[#9d6cff]' : 'text-[#ff5c3a]'}`}>
                    {m.balance >= 0 ? "+" : ""}{formatCurrency(m.balance)}
                  </span>
                  <span className="font-mono-dm text-[0.6rem] text-white/22 tracking-[0.06em] font-medium text-right">NET</span>
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
