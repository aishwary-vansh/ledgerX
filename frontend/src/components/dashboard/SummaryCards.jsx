import { useTransactions } from "../../contexts/TransactionContext";
import {
  getTotalIncome,
  getTotalExpenses,
  getNetBalance,
  formatCurrency,
} from "../../utils/helpers";

const Card = ({ title, value, sub, accent, icon }) => {
  return (
    <div 
      className="p-6 rounded-2xl bg-card border border-border-custom relative overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-none group" 
      style={{ boxShadow: `0 0 35px ${accent}10`, borderColor: `${accent}25` }}
    >
      <div className="absolute -top-9 -right-9 w-32 h-32 rounded-full blur-[40px] opacity-20 transition-opacity group-hover:opacity-30" style={{ background: accent }} />
      <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }} />
      <div className="flex justify-between items-center mb-[1rem] relative z-10">
        <span className="text-[0.85rem] text-white/42 font-[500]">{title}</span>
        <span className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[1rem] transition-transform group-hover:scale-110" style={{ background: `${accent}22` }}>{icon}</span>
      </div>
      <div className="relative z-10 font-syne text-[1.8rem] font-[800] tracking-[-0.03em] leading-none mb-[0.35rem]">{value}</div>
      <div className="relative z-10 text-[0.72rem] text-white/22 font-mono-dm tracking-tight">{sub}</div>
    </div>
  );
};

const SummaryCards = () => {
  const { transactions } = useTransactions();
  const income   = getTotalIncome(transactions);
  const expenses = getTotalExpenses(transactions);
  const balance  = getNetBalance(transactions);

  const cards = [
    { title: "Total Balance",  value: formatCurrency(balance),  sub: "Net across all months",   accent: "var(--color-accent2)", icon: "💰" },
    { title: "Total Income",   value: formatCurrency(income),   sub: "All income sources",       accent: "var(--color-green)", icon: "📈" },
    { title: "Total Expenses", value: formatCurrency(expenses), sub: "All spending combined",    accent: "var(--color-red)", icon: "📉" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((c) => (
        <Card key={c.title} {...c} />
      ))}
    </div>
  );
};

export default SummaryCards;