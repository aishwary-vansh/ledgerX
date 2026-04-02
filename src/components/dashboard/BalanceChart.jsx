import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { useTransactions } from "../../contexts/TransactionContext";
import { getMonthlyData, formatCurrency } from "../../utils/helpers";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl p-3 text-sm bg-card2 border border-white/10 shadow-xl min-w-[170px] slide-up">
      <p className="font-syne font-bold text-white mb-2 tracking-tight">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex justify-between items-center mt-1.5" style={{ color: p.color }}>
          <span className="font-medium text-[0.8rem] opacity-70">{p.name}:</span>
          <span className="font-mono-dm font-bold text-[0.8rem]">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

const BalanceChart = () => {
  const { transactions } = useTransactions();
  const data = getMonthlyData(transactions);

  if (!data.length)
    return (
      <div className="flex items-center justify-center h-48 text-white/20 font-mono-dm text-sm italic">
        No data available
      </div>
    );

  return (
    <div className="p-5 rounded-2xl bg-card border border-border-custom shadow-sm relative overflow-hidden group">
      <div className="font-syne text-[0.9rem] font-bold mb-6 flex items-center gap-2 text-white">
        <span className="w-[7px] h-[7px] rounded-full bg-accent animate-pulse" />
        Monthly Balance Trend
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0}   />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}   />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis 
            dataKey="label" 
            tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10, fontFamily: "DM Mono" }} 
            axisLine={false} 
            tickLine={false} 
            dy={10}
          />
          <YAxis 
            tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 9, fontFamily: "DM Mono" }} 
            axisLine={false} 
            tickLine={false}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} 
            dx={-5}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.08)", strokeWidth: 1 }} />
          <Legend
            wrapperStyle={{ fontSize: 10, fontFamily: "DM Mono", paddingTop: 15, color: "rgba(255,255,255,0.4)" }}
          />
          <Area 
            type="monotone" dataKey="income" name="Income"
            stroke="#22c55e" strokeWidth={2.5} fill="url(#incomeGrad)" 
            dot={{ fill: "#22c55e", r: 4, strokeWidth: 0 }} 
            activeDot={{ r: 6, strokeWidth: 0, stroke: "#22c55e" }}
          />
          <Area 
            type="monotone" dataKey="expenses" name="Expenses"
            stroke="#ef4444" strokeWidth={2.5} fill="url(#expenseGrad)" 
            dot={{ fill: "#ef4444", r: 4, strokeWidth: 0 }} 
            activeDot={{ r: 6, strokeWidth: 0, stroke: "#ef4444" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BalanceChart;