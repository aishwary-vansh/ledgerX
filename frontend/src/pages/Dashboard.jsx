import SummaryCards from "../components/dashboard/SummaryCards";
import BalanceChart from "../components/dashboard/BalanceChart";
import CategoryChart from "../components/dashboard/CategoryChart";
import { useTransactions } from "../contexts/TransactionContext";
import { getHighestCategory, getMoMChange, formatCurrency } from "../utils/helpers";
import { CATEGORY_COLORS } from "../utils/mockData";

const Dashboard = () => {
  const { transactions } = useTransactions();

  const highest = getHighestCategory(transactions);
  const mom     = getMoMChange(transactions);

  return (
    <div className="flex flex-col gap-6 fade-in">
      {/* Summary Cards */}
      <SummaryCards />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {highest && (
          <div className="p-[1.2rem_1.4rem] rounded-[13px] bg-card border border-border-custom flex flex-col gap-1.5 shadow-sm" style={{borderColor: `${CATEGORY_COLORS[highest.name]}22`}}>
            <div className="text-[0.8rem] text-white/28 font-medium">🔥 Highest Spending Category</div>
            <div className="text-[1rem] font-[700]" style={{color: CATEGORY_COLORS[highest.name]}}>{highest.name} — {formatCurrency(highest.value)}</div>
          </div>
        )}
        {mom && (
          <div className="p-[1.2rem_1.4rem] rounded-[13px] bg-card border border-border-custom flex flex-col gap-1.5 shadow-sm" style={{borderColor: mom.change > 0 ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)'}}>
            <div className="text-[0.8rem] text-white/28 font-medium">📅 Month-over-Month Expenses</div>
            <div className="text-[1rem] font-[700]" style={{color: mom.change > 0 ? '#ef4444' : '#22c55e'}}>
              {mom.change > 0 ? "▲" : "▼"} {Math.abs(mom.change)}% vs last month
            </div>
          </div>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BalanceChart />
        <CategoryChart />
      </div>
    </div>
  );
};

export default Dashboard;