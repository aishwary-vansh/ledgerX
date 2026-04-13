import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useTransactions } from "../../contexts/TransactionContext";
import { getCategoryBreakdown, formatCurrency } from "../../utils/helpers";
import { CATEGORY_COLORS } from "../../utils/mockData";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="rounded-xl p-3 bg-card2 border border-white/10 shadow-xl slide-up">
      <p className="font-syne font-bold text-[0.85rem] mb-1.5" style={{ color: d.payload.fill }}>
        {d.name}
      </p>
      <p className="text-white font-mono-dm text-[0.9rem] font-bold">{formatCurrency(d.value)}</p>
    </div>
  );
};

const CategoryChart = () => {
  const { transactions } = useTransactions();
  const data = getCategoryBreakdown(transactions);

  if (!data.length)
    return (
      <div className="flex items-center justify-center h-48 text-white/20 font-mono-dm text-sm italic">
        No expense data
      </div>
    );

  return (
    <div className="p-5 rounded-2xl bg-card border border-border-custom shadow-sm group">
      <div className="font-syne text-[0.9rem] font-bold mb-4 flex items-center gap-2 text-white">
        <span className="w-[7px] h-[7px] rounded-full bg-accent2" />
        Spending by Category
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={4}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={CATEGORY_COLORS[entry.name] || "#6366f1"}
                className="transition-all duration-300 hover:opacity-80"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            formatter={(value) => (
              <span className="text-[9px] font-mono-dm text-white/38 uppercase tracking-wider ml-1">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryChart;